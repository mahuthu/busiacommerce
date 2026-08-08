import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import './Admin.css';

const AdminLogin = () => {
  const { signIn, user, loading, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/admin';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-brand">
          <img src="/images/busialogo.png" alt="Busia Fridge World" />
          <h1>Admin Portal</h1>
          <p>Sign in to manage products</p>
        </div>

        {!configured && (
          <div className="admin-alert error">
            Missing Supabase env vars. Copy <code>.env.example</code> to <code>.env</code> and fill in your project keys.
          </div>
        )}

        {error && <div className="admin-alert error">{error}</div>}

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={!configured || submitting}
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={!configured || submitting}
          />
        </label>

        <button type="submit" className="admin-btn primary" disabled={!configured || submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <a href="/" className="admin-back-link">← Back to storefront</a>
      </form>
    </div>
  );
};

export default AdminLogin;
