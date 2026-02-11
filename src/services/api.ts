
const API_BASE_URL = 'https://worker.aroloyeayodele61.workers.dev/api';

// Helper function for fetching data
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.err || 'API request failed');
  }
  return response.json();
}

// === Authentication ===
export const login = (username: string, password: string) => {
  return fetchApi('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// === Properties ===
export const getFeaturedProperties = () => fetchApi('/properties/featured');
export const getAllProperties = (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return fetchApi(`/properties${query}`);
};
export const getPropertyById = (id: string) => fetchApi(`/properties/${id}`);

// === Admin: Properties CRUD ===
export const getAdminProperties = (token: string) => {
    return fetchApi('/admin/properties', { headers: { 'Authorization': `Bearer ${token}` } });
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

// === Admin: Image Upload ===
export const uploadImage = (file: File, token: string) => {
    const formData = new FormData();
    formData.append('image', file);
    
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
