const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ADMIN_TOKEN_KEY = 'pegadapalli_admin_token';

async function request(path, options = {}) {
  const hasFormDataBody = options.body instanceof FormData;
  const { headers: customHeaders, ...restOptions } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      ...(hasFormDataBody ? {} : { 'Content-Type': 'application/json' }),
      ...customHeaders
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch {
      // Keep default error message when parsing fails.
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  getAnnouncements: () => request('/announcements'),
  addAnnouncement: (payload, token) =>
    request('/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Admin-Token': token }
    }),

  getContacts: () => request('/contacts'),
  addContact: (payload, token) =>
    request('/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Admin-Token': token }
    }),
  updateContact: (id, payload, token) =>
    request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'X-Admin-Token': token }
    }),
  deleteContact: (id, token) =>
    request(`/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token }
    }),

  getShops: () => request('/shops'),
  addShop: (payload, token) =>
    request('/shops', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Admin-Token': token }
    }),
  deleteShop: (id, token) =>
    request(`/shops/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token }
    }),

  getGalleryImages: () => request('/gallery-images'),
  addGalleryImage: (payload, token) =>
    request('/gallery-images', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'X-Admin-Token': token }
    }),
  uploadGalleryImage: ({ title, category, file }, token) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('file', file);

    return request('/gallery-images/upload', {
      method: 'POST',
      body: formData,
      headers: { 'X-Admin-Token': token }
    });
  },
  deleteGalleryImage: (id, token) =>
    request(`/gallery-images/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token }
    }),

  getComplaints: () => request('/complaints'),
  updateComplaintStatus: (id, status, token) =>
    request(`/complaints/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: { 'X-Admin-Token': token }
    }),
  addComplaint: (payload) => request('/complaints', { method: 'POST', body: JSON.stringify(payload) }),

  loginAdmin: (payload) => request('/admin/login', { method: 'POST', body: JSON.stringify(payload) })
};

export const adminAuth = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  setToken: (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(ADMIN_TOKEN_KEY)
};
