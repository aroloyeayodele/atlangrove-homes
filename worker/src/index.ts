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

// Add CORS middleware to allow cross-origin requests
app.use('/api/*', cors());

// --- CONTACT FORM ROUTE ---

app.post('/api/contact', async (c) => {
  const { name, email, phone, message } = await c.req.json();

  if (!name || !email || !message) {
    return c.json({ err: 'Name, email, and message are required' }, 400);
  }

  try {
    await c.env.DB.prepare(
      'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)'
    ).bind(name, email, phone, message).run();

    return c.json({ message: 'Inquiry submitted successfully' });

  } catch (e) {
    const error = e as Error;
    console.error('Error submitting inquiry:', error.message);
    return c.json({ err: 'Failed to submit inquiry' }, 500);
  }
});


// --- PUBLIC BLOG ROUTES ---

app.get('/api/blogs', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM blogs WHERE status = ? ORDER BY created_at DESC').bind('published').all();
    return c.json(results);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.get('/api/blogs/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ? AND status = ?').bind(id, 'published').first();
    if (!post) {
      return c.json({ err: 'Blog post not found' }, 404);
    }
    return c.json(post);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

// --- PUBLIC PROPERTY ROUTES ---

app.get('/api/properties/featured', async (c) => {
    try {
        const { results } = await c.env.DB.prepare('SELECT * FROM properties WHERE status = ? ORDER BY created_at DESC LIMIT 3').bind('available').all();
        return c.json(results);
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

app.get('/api/properties', async (c) => {
  const { category } = c.req.query();
  try {
    let query;
    if (category && category !== 'all') {
      query = c.env.DB.prepare('SELECT * FROM properties WHERE status = ? AND property_type = ? ORDER BY created_at DESC').bind('available', category);
    } else {
      query = c.env.DB.prepare('SELECT * FROM properties WHERE status = ? ORDER BY created_at DESC').bind('available');
    }
    const { results } = await query.all();
    return c.json(results);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.get('/api/properties/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
    if (!property) {
      return c.json({ err: 'Property not found' }, 404);
    }
    return c.json(property);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

// --- MEDIA ROUTES ---

app.get('/media/:key', async (c) => {
  const key = c.req.param('key');
  try {
    const object = await c.env.MEDIA_BUCKET.get(key);
    if (object === null) {
      return c.json({ err: 'Object not found' }, 404);
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    return new Response(object.body, {
      headers,
    });
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

// --- ADMIN ROUTES ---

app.post('/api/admin/login', async (c) => {
    const { username, password } = await c.req.json();
    if (!username || !password) {
        return c.json({ err: 'Username and password are required' }, 400);
    }
    try {
        const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
        if (!user || password !== user.password) {
            return c.json({ err: 'Invalid username or password' }, 401);
        }
        const token = await sign({ id: user.id, username: user.username }, c.env.JWT_SECRET);
        return c.json({ token: token, message: 'Login successful' });
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

// Middleware for protected routes
const authMiddleware = jwt({ secret: c.env.JWT_SECRET });

app.use('/api/admin/inquiries', authMiddleware);
app.use('/api/admin/upload', authMiddleware);
app.use('/api/admin/blogs', authMiddleware);
app.use('/api/admin/blogs/*', authMiddleware);
app.use('/api/admin/properties', authMiddleware);
app.use('/api/admin/properties/*', authMiddleware);

// --- Admin: Inquiries ---
app.get('/api/admin/inquiries', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM inquiries ORDER BY submitted_at DESC').all();
    return c.json(results);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

// --- Admin: Blogs ---
app.get('/api/admin/blogs', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
    return c.json(results);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.get('/api/admin/blogs/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
    if (!post) return c.json({ err: 'Blog post not found' }, 404);
    return c.json(post);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.post('/api/admin/blogs', async (c) => {
  const { title, content, status, image_url } = await c.req.json();
  try {
    const { meta } = await c.env.DB.prepare(
      'INSERT INTO blogs (title, content, status, image_url) VALUES (?, ?, ?, ?)'
    ).bind(title, content, status, image_url).run();
    const newId = meta.last_row_id;
    return c.json({ id: newId }, 201);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.put('/api/admin/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const { title, content, status, image_url } = await c.req.json();
  try {
    await c.env.DB.prepare(
      'UPDATE blogs SET title = ?, content = ?, status = ?, image_url = ? WHERE id = ?'
    ).bind(title, content, status, image_url, id).run();
    return c.json({ message: 'Blog post updated successfully' });
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.delete('/api/admin/blogs/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare('DELETE FROM blogs WHERE id = ?').bind(id).run();
    return c.json({ message: 'Blog post deleted successfully' });
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});


// --- Admin: Properties ---
app.get('/api/admin/properties', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();
    return c.json(results);
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

app.get('/api/admin/properties/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
        if (!property) {
            return c.json({ err: 'Property not found' }, 404);
        }
        return c.json(property);
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

app.post('/api/admin/properties', async (c) => {
    const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
    try {
        const { meta } = await c.env.DB.prepare(
            'INSERT INTO properties (name, address, price, bedrooms, bathrooms, property_type, status, description, features, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, JSON.stringify(features), JSON.stringify(images)).run();
        return c.json({ id: meta.last_row_id }, 201);
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

app.put('/api/admin/properties/:id', async (c) => {
    const id = c.req.param('id');
    const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
    try {
        await c.env.DB.prepare(
            'UPDATE properties SET name = ?, address = ?, price = ?, bedrooms = ?, bathrooms = ?, property_type = ?, status = ?, description = ?, features = ?, images = ? WHERE id = ?'
        ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, JSON.stringify(features), JSON.stringify(images), id).run();
        return c.json({ message: 'Property updated successfully' });
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

app.delete('/api/admin/properties/:id', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.DB.prepare('DELETE FROM properties WHERE id = ?').bind(id).run();
        return c.json({ message: 'Property deleted successfully' });
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});


// --- Admin: Image Upload ---
app.post('/api/admin/upload', async (c) => {
  try {
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
  } catch (e) {
    const error = e as Error;
    return c.json({ err: error.message }, 500);
  }
});

// --- STATIC ASSETS & SPA FALLBACK ---

// Serve static assets from the root directory.
app.use('/*', serveStatic({ root: './' }));

// SPA fallback: for any request that did not match a static file,
// serve the index.html. This allows the client-side router to take over.
app.get('*', serveStatic({ path: './index.html' }));

export default app;