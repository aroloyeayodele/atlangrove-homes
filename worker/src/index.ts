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
  console.error(`Unhandled error: ${err.message}`, err);
  return c.json({ err: 'An internal server error occurred', message: err.message, stack: err.stack }, 500);
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

// This route now uses a wildcard to handle nested paths in keys (e.g., 'lovable-uploads/image.png')
app.get('/api/media/*', async (c) => {
  // Get the path after /media/
  const key = c.req.path.substring('/api/media/'.length);
  const object = await c.env.MEDIA_BUCKET.get(key);
  if (object === null) {
    return c.json({ err: 'Object not found' }, 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
});

// Create a new Hono instance for all admin routes
const admin = new Hono<{ Bindings: Env }>();

// --- UNPROTECTED ADMIN ROUTES ---

admin.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ err: 'Username and password are required' }, 400);
    }
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').bind(username).first();
    if (!user || password !== user.password) {
      return c.json({ err: 'Invalid username or password' }, 401);
    }
    const token = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
    return c.json({ token: token, message: 'Login successful' });
  } catch (err: any) {
    console.error('Login error:', err.stack);
    return c.json({ err: `Login failed: ${err.message}`}, 500);
  }
});

// --- PROTECTED ADMIN ROUTES ---

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
  const { results } = await c.env.DB.prepare('SELECT id, title, status, created_at FROM blogs ORDER BY created_at DESC').all();
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
  const payload = c.get('jwtPayload');
  const author_id = payload.id; // Get author ID from JWT payload
  const { meta } = await c.env.DB.prepare('INSERT INTO blogs (title, content, author_id, status, image_url) VALUES (?, ?, ?, ?, ?)')
    .bind(title, content, author_id, status, image_url)
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
  if (!property) return c.json({ err: 'Property not found' }, 404);
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
  console.log('--- New file upload request ---');
  try {
    if (!c.env.MEDIA_BUCKET) {
      console.error('R2 BUCKET NOT BOUND. Check wrangler.toml and Cloudflare dashboard.');
      return c.json({ err: 'Server configuration error: R2 bucket not configured.' }, 500);
    }
    console.log('R2 bucket binding is present.');

    const formData = await c.req.formData();
    console.log('Successfully parsed formData.');

    const file = formData.get('file');
    if (!(file instanceof File)) {
      console.error('Form data is missing a valid file.');
      return c.json({ err: 'No file to upload or incorrect form data' }, 400);
    }
    console.log(`Received file: name='${file.name}', type='${file.type}', size=${file.size} bytes.`);

    // Sanitize filename and create a key for R2
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const key = `lovable-uploads/${Date.now()}-${sanitizedFilename}`;
    console.log(`Generated R2 key: '${key}'`);

    const arrayBuffer = await file.arrayBuffer();
    console.log(`File content read into arrayBuffer, size=${arrayBuffer.byteLength}.`);

    console.log('Attempting to upload to R2...');
    await c.env.MEDIA_BUCKET.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });
    console.log('--- Successfully uploaded to R2 ---');

    const url = `/api/media/${key}`;
    return c.json({ key: key, url: url, message: `File uploaded successfully!` });

  } catch (err: any) {
    console.error('--- UPLOAD FAILED ---');
    console.error('Error object:', err);
    return c.json({
      err: 'Upload failed.',
      message: err.message,
      stack: err.stack,
    }, 500);
  }
});

// Mount the admin sub-app under the /api/admin prefix
app.route('/api/admin', admin);

// --- STATIC ASSETS & SPA FALLBACK ---

// This must be declared after all other routes
app.use('/*', serveStatic({ root: './' }));
app.get('*', serveStatic({ path: './index.html' }));

export default app;
