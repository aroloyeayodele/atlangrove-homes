
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

const getBaseUrl = (c: any) => {
  try {
    const url = new URL(c.req.url);
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    // Fallback if c.req.url is just a path
    return '';
  }
};

// --- DEBUG ROUTE ---
app.get('/api/debug-db', async (c) => {
  try {
    const tables = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableData: any = {};

    if (tables.results) {
      for (const table of (tables.results as any[])) {
        try {
          const count = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).first('count');
          tableData[table.name] = { count };
        } catch (e: any) {
          tableData[table.name] = { error: e.message };
        }
      }
    }

    return c.json({
      db_status: 'connected',
      tables: tables.results,
      counts: tableData,
      users: (await c.env.DB.prepare("SELECT id, username FROM users").all()).results,
      env: c.env.ENV,
      database_id: 'DEBUG-V3-a39b3095-7aa3-4646-85ee-cc9f6798566a'
    });
  } catch (err: any) {
    console.error('Debug route failed:', err);
    return c.json({
      err: 'Debug route failed',
      message: err.message,
      stack: err.stack
    }, 500);
  }
});

const toAbsoluteUrl = (c: any, relativeUrl: string | null | undefined) => {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  const baseUrl = getBaseUrl(c);
  // Remove duplicate /api prefix if present
  const normalizedRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
  return `${baseUrl}${normalizedRelativeUrl}`;
};

const safeJsonParse = (val: any, fallback: any = []) => {
  if (typeof val !== 'string') return val || fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
};

const transformPost = (c: any, post: any) => {
  if (!post) return null;
  try {
    const relativeImageUrl = post.image_url || '';
    return {
      id: post.id,
      _id: post.id,
      title: post.title || 'Untitled Post',
      content: post.content || '',
      authorId: post.author_id,
      status: post.status,
      imageUrl: toAbsoluteUrl(c, relativeImageUrl),
      createdAt: post.created_at,
      summary: post.content ? post.content.substring(0, 150) + '...' : '',
      image: toAbsoluteUrl(c, relativeImageUrl),
    };
  } catch (err: any) {
    console.error('transformPost error:', err.message);
    return post;
  }
};

const transformProperty = (c: any, prop: any) => {
  if (!prop) return null;

  try {
    const imageUrls = safeJsonParse(prop.images, []);
    const absoluteImages = Array.isArray(imageUrls)
      ? imageUrls.map(url => toAbsoluteUrl(c, url))
      : [];

    return {
      ...prop,
      // Handle both potential schemas (name/address vs title/location)
      title: prop.title || prop.name || 'Untitled Property',
      location: prop.location || prop.address || 'Unknown Location',
      category: prop.category || prop.property_type || 'unspecified',
      imageUrl: absoluteImages[0] || prop.image_url || '',

      // Modern/Standard fields
      images: JSON.stringify(absoluteImages),
      _images: absoluteImages,
      displayPrice: prop.price ? `₦${Number(prop.price).toLocaleString()}` : 'Price on request',
      features: safeJsonParse(prop.features, [])
    };
  } catch (err: any) {
    console.error('transformProperty error:', err.message);
    return prop; // Return raw if transform fails
  }
}

// Add a global error handler
app.onError((err, c) => {
  console.error('SERVER ERROR:', err);
  const errorDetail = {
    err: 'Internal Server Error',
    message: err.message,
    method: c.req.method,
    stack: err.stack
  };
  return c.json(errorDetail, 500);
});

// Add CORS middleware
app.use('/api/*', cors());

// --- PUBLIC ROUTES: CONTACT ---

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

// --- PUBLIC ROUTES: BLOGS ---

app.get('/api/blogs', async (c) => {
  try {
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    const { results } = await c.env.DB.prepare('SELECT * FROM blogs WHERE status = ? ORDER BY id DESC')
      .bind('published')
      .all();
    const items = results || [];
    return c.json(items.map(p => transformPost(c, p)));
  } catch (err: any) {
    console.error('Fetch blogs failed:', err.message);
    throw err;
  }
});

app.get('/api/blogs/:id', async (c) => {
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  const idParam = c.req.param('id');
  const id = parseInt(idParam, 10);

  if (isNaN(id)) {
    return c.json({ err: 'Invalid post ID format' }, 400);
  }

  const post = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?')
    .bind(id)
    .first();

  if (!post || post.status !== 'published') {
    return c.json({ err: 'Blog post not found or not published' }, 404);
  }

  return c.json(transformPost(c, post));
});

// --- PUBLIC ROUTES: PROPERTIES ---

app.get('/api/properties', async (c) => {
  const category = c.req.query('category');
  let query = 'SELECT * FROM properties WHERE status = ?';
  let params: any[] = ['available'];

  if (category && category !== 'all') {
    query += ' AND property_type = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  const items = results || [];
  return c.json(items.map(p => transformProperty(c, p)));
});

app.get('/api/properties/featured', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM properties WHERE status = ? LIMIT 6')
    .bind('available')
    .all();
  const items = results || [];
  return c.json(items.map(p => transformProperty(c, p)));
});

app.get('/api/properties/:id', async (c) => {
  const id = c.req.param('id');
  const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
  if (!property) return c.json({ err: 'Property not found' }, 404);
  return c.json(transformProperty(c, property));
});

// --- MEDIA SERVING ROUTE ---
app.get('/api/serve-media/*', async (c) => {
  const key = c.req.path.replace('/api/serve-media/', '');
  const object = await c.env.MEDIA_BUCKET.get(key);

  if (object === null) {
    return c.json({ err: 'Object Not Found' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  // Important for image rendering
  headers.set('Cache-Control', 'public, max-age=31536000');

  return new Response(object.body, {
    headers,
  });
});


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
    return c.json({ err: `Login failed: ${err.message}` }, 500);
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
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
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
  if (!payload?.id) return c.json({ err: 'Authorization error' }, 403);

  const { meta } = await c.env.DB.prepare('INSERT INTO blogs (title, content, author_id, status, image_url) VALUES (?, ?, ?, ?, ?)')
    .bind(title, content, payload.id, status, image_url)
    .run();
  return c.json({ id: meta.last_row_id }, 201);
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
  const items = results || [];
  return c.json(items.map(p => transformProperty(c, p)));
});

admin.get('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const property = await c.env.DB.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
  if (!property) return c.json({ err: 'Property not found' }, 404);
  return c.json(transformProperty(c, property));
});

admin.post('/properties', async (c) => {
  const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
  const { meta } = await c.env.DB.prepare(
    'INSERT INTO properties (name, address, price, bedrooms, bathrooms, property_type, status, description, features, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, features, images).run();
  return c.json({ id: meta.last_row_id }, 201);
});

admin.put('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const { name, address, price, bedrooms, bathrooms, property_type, status, description, features, images } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE properties SET name = ?, address = ?, price = ?, bedrooms = ?, bathrooms = ?, property_type = ?, status = ?, description = ?, features = ?, images = ? WHERE id = ?'
  ).bind(name, address, price, bedrooms, bathrooms, property_type, status, description, features, images, id).run();
  return c.json({ message: 'Property updated successfully' });
});

admin.delete('/properties/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM properties WHERE id = ?').bind(id).run();
  return c.json({ message: 'Property deleted successfully' });
});

// --- Admin: Inquiries ---
admin.get('/inquiries', async (c) => {
  try {
    // In actual schema, it's created_at, not id
    const { results } = await c.env.DB.prepare('SELECT * FROM inquiries ORDER BY submitted_at DESC').all();
    return c.json(results || []);
  } catch (err: any) {
    console.error('Inquiries fetch error:', err.message);
    throw err;
  }
});

// --- Admin: Image Upload ---
admin.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return c.json({ err: 'No file to upload or incorrect form data' }, 400);
  }
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const key = `uploads/${Date.now()}-${sanitizedFilename}`;
  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  const relativeUrl = `/api/serve-media/${key}`;
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
