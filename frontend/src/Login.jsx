import { useState } from 'react';
import Toast from './Toast';

const API_URL = import.meta.env.VITE_API_URL || '';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setToast({
        message: 'Email and password are required',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          message: data.message || 'Login failed',
          type: 'error',
        });
        return;
      }

      localStorage.setItem('token', data.token);

      setToast({
        message: data.message || 'Login successful',
        type: 'success',
      });

      onLogin();
    } catch (error) {
      console.error('Login error:', error);

      setToast({
        message: 'Unable to connect to the server',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  );
}

export default Login;