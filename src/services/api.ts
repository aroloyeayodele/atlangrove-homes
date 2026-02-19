
// @ts-ignore
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://atlangrove.aroloyeayodele61.workers.dev/api';

// Helper function for fetching JSON data
async function fetchApi(path: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (!response.ok) {
        let error;
        const responseClone = response.clone();
        try {
            const errorJson = await response.json();
            error = new Error(errorJson.err || errorJson.message || 'An unknown API error occurred.');
        } catch (e) {
            const responseText = await responseClone.text();
            error = new Error(responseText || `Error ${response.status}: ${response.statusText}`);
        }
        throw error;
    }

    // Handle empty response body for methods like DELETE
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();

}


// === Authentication ===
export const login = (username: string, password: string) => {
    return fetchApi('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
};

// === Public Routes ===
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
export const getAllBlogs = async () => {
    const blogs = await fetchApi('/blogs');
    return Array.isArray(blogs) ? blogs : [];
}
export const getBlogById = (id: string) => fetchApi(`/blogs/${id}`);
export const submitContactForm = (formData: { name: string; email: string; phone: string; message: string; }) => {
    return fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
    });
}

// === Admin Routes (require token) ===
const getAuthHeaders = (token: string) => ({ 'Authorization': `Bearer ${token}` });

// --- Properties ---
export const getAdminProperties = (token: string) => {
    return fetchApi('/admin/properties', { headers: getAuthHeaders(token) });
};
export const getAdminPropertyById = (id: string, token: string) => {
    return fetchApi(`/admin/properties/${id}`, { headers: getAuthHeaders(token) });
};
export const createProperty = (propertyData: any, token: string) => {
    return fetchApi('/admin/properties', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(propertyData),
    });
};
export const updateProperty = (id: string, propertyData: any, token: string) => {
    return fetchApi(`/admin/properties/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(propertyData),
    });
};
export const deleteProperty = (id: string, token: string) => {
    return fetchApi(`/admin/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
    });
};

// --- Inquiries ---
export const getInquiries = (token: string) => {
    return fetchApi('/admin/inquiries', { headers: getAuthHeaders(token) });
};

// --- Blogs ---
export const getAdminBlogs = async (token: string) => {
    const blogs = await fetchApi('/admin/blogs', { headers: getAuthHeaders(token) });
    return Array.isArray(blogs) ? blogs : [];
};
export const getAdminBlogById = (id: string, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, { headers: getAuthHeaders(token) });
};
export const createBlog = (blogData: any, token: string) => {
    return fetchApi('/admin/blogs', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(blogData),
    });
};
export const updateBlog = (id: string, blogData: any, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(blogData),
    });
};
export const deleteBlog = (id: string, token: string) => {
    return fetchApi(`/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
    });
};


// === Admin: Image Upload (Correct Implementation) ===
export const uploadImage = (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    // 1. Create a Headers object.
    const headers = new Headers();

    // 2. Append the Authorization header.
    headers.append('Authorization', `Bearer ${token}`);

    // 3. Make the fetch request. DO NOT set the 'Content-Type' header manually.
    // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
    return fetch(`${API_BASE_URL}/admin/upload`, {
        method: 'POST',
        headers: headers, // Use the Headers object
        body: formData,
    }).then(async res => {
        const resClone = res.clone();
        try {
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.message || json.err || `Upload failed with status ${res.status}`);
            }
            return json;
        } catch (e) {
            if (!res.ok) {
                const text = await resClone.text();
                throw new Error(text || `Upload failed with status ${res.status}`);
            }
            throw e;
        }
    });
};
