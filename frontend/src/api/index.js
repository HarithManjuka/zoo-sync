const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('zooToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const get = (endpoint) => apiRequest(endpoint, { method: 'GET' });
export const post = (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const del = (endpoint) => apiRequest(endpoint, { method: 'DELETE' });