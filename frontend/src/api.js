async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    //refresh access token
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('token', data.token);
      const newToken = localStorage.getItem('token');
      return await fetch(url, {
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
