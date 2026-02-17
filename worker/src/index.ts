
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

// --- HELPER FUNCTIONS ---

const getBaseUrl = (c: any) => 'https://atlangrove.aroloyeayodele61.workers.dev';

const toAbsoluteUrl = (c: any, relativeUrl: string | null | undefined) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    const baseUrl = getBaseUrl(c);
    return `${baseUrl}${relativeUrl}`;
}

const transformPost = (c: any, post: any) => {
  if (!post) return null;
  return {
    id: post.id,
    _id: post.id, 
    title: post.title,
    content: post.content,
    authorId: post.author_id,
    status: post.status,
    imageUrl: toAbsoluteUrl(c, post.image_url),
    createdAt: post.created_at, 
    summary: post.content ? post.content.substring(0, 150) + '...' : '',
    image: toAbsoluteUrl(c, post.image_url),
  };
};

// Add a global error handler
app.onError((err, c) => {
  console.error(`Unhandled error: ${err.message}`, err);
  return c.json({ err: 'An internal server error occurred', message: err.message, stack: err.stack }, 500);
});

// Add CORS middleware
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
  return c.json(results.map(p => transformPost(c, p)));
});

app.get('/api/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ? AND status = ?')
    .bind(id, 'published')
    .first();
  if (!post) {
    return c.json({ err: 'Blog post not found' }, 404);
  }
  return c.json(transformPost(c, post));
});

// Other public routes (properties, media) follow...


// --- ADMIN APP ---
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
    const payload = { id: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
    const token = await sign(payload, c.env.JWT_SECRET, 'HS256');
    return c.json({ token: token, message: 'Login successful' });
  } catch (err: any) {
    console.error('Login error:', err.stack);
    return c.json({ err: `Login failed: ${err.message}`}, 500);
  }
});

// --- PROTECTED ADMIN ROUTES ---
admin.use('/*', async (c, next) => {
  const jwtMiddleware = jwt({ 
    secret: c.env.JWT_SECRET,
    alg: 'HS256'
  });
  return jwtMiddleware(c, next);
});

// --- Admin: Blogs ---
admin.get('/blogs', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
  return c.json(results.map(p => transformPost(c, p)));
});

admin.get('/blogs/:id', async (c) => {
  const id = c.req.param('id');
  const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
  if (!post) return c.json({ err: 'Blog post not found' }, 404);
  return c.json(transformPost(c, post));
});

admin.post('/blogs', async (c) => {
    const { title, content, status, image_url } = await c.req.json();
    const payload = c.get('jwtPayload');

    if (!payload || !payload.id) {
        return c.json({ err: 'Authorization error', message: 'Invalid token payload.' }, 403);
    }
    const author_id = payload.id;

    const { meta } = await c.env.DB.prepare('INSERT INTO blogs (title, content, author_id, status, image_url) VALUES (?, ?, ?, ?, ?)')
        .bind(title, content, author_id, status, image_url)
        .run();
    const newId = meta.last_row_id;
    return c.json({ id: newId }, 201);
});

admin.put('/blogs/:id', async (c) => {
    const id = c.req.param('id');
    const { title, content, status, image_url } = await c.req.json();
    
    const payload = c.get('jwtPayload');
    if (!payload || !payload.id) {
        return c.json({ err: 'Authorization error', message: 'Invalid token payload.' }, 403);
    }

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

// --- Admin: Image Upload ---
admin.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return c.json({ err: 'No file to upload or incorrect form data' }, 400);
  }
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const key = `lovable-uploads/${Date.now()}-${sanitizedFilename}`;
  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  const relativeUrl = `/api/media/${key}`;
  return c.json({ 
    key: key, 
    url: relativeUrl, 
    absoluteUrl: toAbsoluteUrl(c, relativeUrl),
    message: `File uploaded successfully!` 
  });
});


// Mount the admin sub-app
app.route('/api/admin', admin);

// --- STATIC ASSETS & SPA FALLBACK ---
app.use('/*', serveStatic({ root: './' }));
app.get('*', serveStatic({ path: './index.html' }));

export default app;
