import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';
import { serveStatic } from 'hono/cloudflare-workers';

// Define the database and R2 bucket bindings
interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Add a global error handler
app.onError((err, c) => {
  console.error(`Unhandled error: ${err.message}`, err.stack);
  return c.json({ err: 'An internal server error occurred (v2)', message: err.message, stack: err.stack }, 500);
});

// Add CORS middleware to allow cross-origin requests
app.use('/api/*', cors());

// --- PUBLIC ROUTES ---

app.post('/api/contact', async (c) => {
  const { name, email, phone, message } = await c.req.json();
  if (!name || !email || !message) {
    return c.json({ err: 'Name, email, and message are required' }, 400);
  }
  await c.env.DB.prepare('INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)')
    .bind(name, email, phone, message)
    .run();
  return c.json({ message: 'Inquiry submitted successfully' });
});

app.get('/api/blogs', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blogs WHERE status = ? ORDER BY created_at DESC')
    .bind('published')
    .all();
  return c.json(results);
});

app.get('/api/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ? AND status = ?')
    .bind(id, 'published')
    .first();
  if (!post) {
    return c.json({ err: 'Blog post not found' }, 404);
  }
  return c.json(post);
});

app.get('/api/properties/featured', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM properties WHERE status = ? ORDER BY created_at DESC LIMIT 3')
    .bind('available')
    .all();
  return c.json(results);
});

app.get('/api/properties', async (c) => {
  const { category } = c.req.query();
  let query;
  if (category && category !== 'all') {
    query = c.env.DB.prepare('SELECT * FROM properties WHERE status = ? AND property_type = ? ORDER BY created_at DESC')
      .bind('available', category);
  } else {
    query = c.env.DB.prepare('SELECT * FROM properties WHERE status = ? ORDER BY created_at DESC')
      .bind('available');
  }
  const { results } = await query.all();
  return c.json(results);
});

app.get('/api/properties/:id', async (c) => {
  const id = c.req.param('id');
  const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
  if (!property) {
    return c.json({ err: 'Property not found' }, 404);
  }
  return c.json(property);
});

app.get('/media/:key', async (c) => {
  const key = c.req.param('key');
  const object = await c.env.MEDIA_BUCKET.get(key);
  if (object === null) {
    return c.json({ err: 'Object not found' }, 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
});

// --- ADMIN ROUTES ---

// Public login route
app.post('/api/admin/login', async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ err: 'Username and password are required' }, 400);
  }
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user || password !== user.password) { // In a real app, use a secure password hashing library like bcrypt
    return c.json({ err: 'Invalid username or password' }, 401);
  }
  const token = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
  return c.json({ token: token, message: 'Login successful' });
});

// Create a new Hono instance for protected admin routes
const admin = new Hono<{ Bindings: Env }>();

// Apply JWT middleware to the entire admin sub-app
// Let the global onError handler catch any errors from the JWT middleware
admin.use('/*', async (c, next) => {
  const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
  return jwtMiddleware(c, next);
});


// --- Admin: Inquiries ---
admin.get('/inquiries', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM inquiries ORDER BY submitted_at DESC').all();
  return c.json(results);
});

// --- Admin: Blogs ---
admin.get('/blogs', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
  return c.json(results);
});

admin.get('/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
  if (!post) return c.json({ err: 'Blog post not found' }, 404);
  return c.json(post);
});

admin.post('/blogs', async (c) => {
  const { title, content, status, image_url } = await c.req.json();
  const { meta } = await c.env.DB.prepare('INSERT INTO blogs (title, content, status, image_url) VALUES (?, ?, ?, ?)')
    .bind(title, content, status, image_url)
    .run();
  const newId = meta.last_row_id;
  return c.json({ id: newId }, 201);
});

admin.put('/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const { title, content, status, image_url } = await c.req.json();
  await c.env.DB.prepare('UPDATE blogs SET title = ?, content = ?, status = ?, image_url = ? WHERE id = ?')
    .bind(title, content, status, image_url, id)
    .run();
  return c.json({ message: 'Blog post updated successfully' });
});

admin.delete('/blogs/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM blogs WHERE id = ?').bind(id).run();
  return c.json({ message: 'Blog post deleted successfully' });
});

// --- Admin: Properties ---
admin.get('/properties', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();
  return c.json(results);
});

admin.get('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
  if (!property) {
    return c.json({ err: 'Property not found' }, 404);
  }
  return c.json(property);
});

admin.post('/properties', async (c) => {
  const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
  const { meta } = await c.env.DB.prepare(
    'INSERT INTO properties (name, address, price, bedrooms, bathrooms, property_type, status, description, features, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, JSON.stringify(features), JSON.stringify(images))
    .run();
  return c.json({ id: meta.last_row_id }, 201);
});

admin.put('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE properties SET name = ?, address = ?, price = ?, bedrooms = ?, bathrooms = ?, property_type = ?, status = ?, description = ?, features = ?, images = ? WHERE id = ?'
  ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, JSON.stringify(features), JSON.stringify(images), id)
    .run();
  return c.json({ message: 'Property updated successfully' });
});

admin.delete('/properties/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM properties WHERE id = ?').bind(id).run();
  return c.json({ message: 'Property deleted successfully' });
});

// --- Admin: Image Upload ---
admin.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return c.json({ err: 'No file to upload or incorrect form data' }, 400);
  }
  const key = `${Date.now()}-${file.name}`;
  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  return c.json({ key: key, message: `File ${key} uploaded successfully!` });
});

// Mount the admin sub-app under the /api/admin prefix
app.route('/api/admin', admin);

// --- STATIC ASSETS & SPA FALLBACK ---

app.use('/*', serveStatic({ root: './' }));
app.get('*', serveStatic({ path: './index.html' }));

export default app;
