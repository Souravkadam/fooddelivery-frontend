import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { login } from '../service/authService';

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(data);
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        await loadCartData(response.data.token);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.status === 401
        ? 'Incorrect email or password.'
        : 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card w-100">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍔</div>
          <h4>Welcome Back!</h4>
          <p>Sign in to continue ordering</p>
        </div>

        <div className="auth-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="you@example.com"
                name="email"
                value={data.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control auth-input"
                  placeholder="Enter your password"
                  name="password"
                  value={data.password}
                  onChange={onChange}
                  required
                  style={{ borderRight: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                  onClick={() => setShowPass(p => !p)}
                >
                  <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-btn w-100 mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              )}
            </button>

            <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
