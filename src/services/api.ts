
const API_BASE_URL = 'https://worker.aroloyeayodele61.workers.dev/api';

// Helper function for fetching data
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // Read the response body as text ONCE.
  const responseText = await response.text();

  if (!response.ok) {
    let error;
    try {
      // Try to parse the text as JSON. If it works, we have a structured error.
      const errorJson = JSON.parse(responseText);
      error = new Error(errorJson.err || errorJson.message || 'An unknown API error occurred.');
    } catch (e) {
      // If parsing fails, the error is the raw text (e.g., an HTML error page).
      error = new Error(responseText || 'An unknown error occurred.');
    }
    throw error;
  }

  // If the response was successful, parse the text we've already read.
  // If the responseText is empty, return null.
  return responseText ? JSON.parse(responseText) : null;
}


// === Authentication ===
export const login = (username: string, password: string) => {
  return fetchApi('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// === Properties ===
export const getFeaturedProperties = async () => {
    const properties = await fetchApi('/properties/featured');
    return Array.isArray(properties) ? properties : [];
};
export const getAllProperties = async (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    const properties = await fetchApi(`/properties${query}`);
    return Array.isArray(properties) ? properties : [];
};
export const getPropertyById = (id: string) => fetchApi(`/properties/${id}`);


// === Blogs ===
export const getAllBlogs = async () => {
    const blogs = await fetchApi('/blogs');
    return Array.isArray(blogs) ? blogs : [];
}
export const getBlogById = (id: string) => fetchApi(`/blogs/${id}`);

// === Admin: Properties CRUD ===
export const getAdminProperties = (token: string) => {
    return fetchApi('/admin/properties', { headers: { 'Authorization': `Bearer ${token}` } });
};

export const getAdminPropertyById = (id: string, token: string) => {
    return fetchApi(`/admin/properties/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
};

export const createProperty = (propertyData: any, token: string) => {
    return fetchApi('/admin/properties', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(propertyData),
    });
};

export const updateProperty = (id: string, propertyData: any, token: string) => {
    return fetchApi(`/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(propertyData),
    });
};

export const deleteProperty = (id: string, token: string) => {
    return fetchApi(`/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
};

// === Admin: Inquiries ===
export const getInquiries = (token: string) => {
    return fetchApi('/admin/inquiries', { headers: { 'Authorization': `Bearer ${token}` } });
};

// === Admin: Blogs CRUD ===
export const getAdminBlogs = async (token: string) => {
    const blogs = await fetchApi('/admin/blogs', { headers: { 'Authorization': `Bearer ${token}` } });
    return Array.isArray(blogs) ? blogs : [];
};

export const getAdminBlogById = (id: string, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
};

export const createBlog = (blogData: any, token: string) => {
    return fetchApi('/admin/blogs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(blogData),
    });
};

export const updateBlog = (id: string, blogData: any, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(blogData),
    });
};

export const deleteBlog = (id: string, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
};


// === Admin: Image Upload ===
export const uploadImage = (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_BASE_URL}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(res => {
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
    });
};

// === Contact Form ===
export const submitContactForm = (formData: { name: string; email: string; phone: string; message: string; }) => {
    return fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
}
