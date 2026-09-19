const API_URL = import.meta.env.VITE_API_URL || '';

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // refresh access token
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();

      localStorage.setItem('token', data.token);

      const newToken = localStorage.getItem('token');

      return await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}

export default apiFetch;
