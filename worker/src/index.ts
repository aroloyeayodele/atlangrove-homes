import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Define the database and R2 bucket bindings
interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware to allow cross-origin requests
app.use('/api/*', cors());

// --- BLOG ROUTES ---

// Route for fetching all blog posts
app.get('/api/blogs', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM blogs WHERE status = ?').bind('published').all();
    return c.json(results);
  } catch (e) {
    return c.json({ err: e }, 500);
  }
});

// Route for fetching a single blog post
app.get('/api/blogs/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).all();
    if (results.length === 0) {
      return c.json({ err: 'Blog post not found' }, 404);
    }
    return c.json(results[0]);
  } catch (e) {
    return c.json({ err: e }, 500);
  }
});

// --- PROPERTY ROUTES (PLACEHOLDERS) ---

app.get('/api/properties', async (c) => {
  // This will eventually fetch all properties from the database
  return c.json({ message: 'Coming soon' });
});

app.get('/api/properties/:id', async (c) => {
  // This will eventually fetch a single property from the database
  const id = c.req.param('id');
  return c.json({ message: `Coming soon for property ${id}` });
});


// --- MEDIA ROUTES ---

// Route for serving files from R2
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
    return c.json({ err: e }, 500);
  }
});

// --- ADMIN ROUTES ---

// Route for admin login
app.post('/api/admin/login', async (c) => {
    const { username, password } = await c.req.json();

    if (!username || !password) {
        return c.json({ err: 'Username and password are required' }, 400);
    }

    try {
        const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();

        if (!user) {
            return c.json({ err: 'Invalid username or password' }, 401);
        }

        if (password !== user.password) {
            return c.json({ err: 'Invalid username or password' }, 401);
        }

        return c.json({ message: 'Login successful' });
    } catch (e) {
        const error = e as Error;
        return c.json({ err: error.message }, 500);
    }
});

// Route for uploading files to R2
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


export default app;
