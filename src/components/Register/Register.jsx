import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../service/authService';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card w-100">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍕</div>
          <h4>Create Account</h4>
          <p>Join us and start ordering today</p>
        </div>

        <div className="auth-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control auth-input"
                placeholder="John Doe"
                name="name"
                value={data.name}
                onChange={onChange}
                required
              />
            </div>

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
                  placeholder="Min. 6 characters"
                  name="password"
                  value={data.password}
                  onChange={onChange}
                  required
                  minLength={6}
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
              {data.password && data.password.length < 6 && (
                <small className="text-danger">Password must be at least 6 characters</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary auth-btn w-100 mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
              ) : (
                <><i className="bi bi-person-plus me-2"></i>Create Account</>
              )}
            </button>

            <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
