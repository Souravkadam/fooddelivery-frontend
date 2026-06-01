import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Simulate submission (wire to backend email service when ready)
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center g-5">

          {/* Left — info */}
          <div className="col-lg-4">
            <h2 className="fw-bold mb-3">Get in Touch</h2>
            <p className="text-muted mb-4">
              Have a question, feedback, or issue with your order? We're here to help.
            </p>
            <ul className="list-unstyled contact-info">
              <li className="mb-3">
                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="mb-3">
                <i className="bi bi-envelope-fill text-primary me-2"></i>
                <span>support@foodland.in</span>
              </li>
              <li className="mb-3">
                <i className="bi bi-telephone-fill text-primary me-2"></i>
                <span>+91 98765 43210</span>
              </li>
              <li className="mb-3">
                <i className="bi bi-clock-fill text-primary me-2"></i>
                <span>Mon–Sun, 9 AM – 11 PM</span>
              </li>
            </ul>
          </div>

          {/* Right — form */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4">
              {submitted ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                  <h5>Message Sent!</h5>
                  <p className="text-muted">We'll get back to you within 24 hours.</p>
                  <button className="btn btn-outline-primary" onClick={() => setSubmitted(false)}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">First Name</label>
                      <input
                        type="text" className="form-control" name="firstName"
                        placeholder="John" value={form.firstName}
                        onChange={onChange} required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Last Name</label>
                      <input
                        type="text" className="form-control" name="lastName"
                        placeholder="Doe" value={form.lastName}
                        onChange={onChange} required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email" className="form-control" name="email"
                        placeholder="you@example.com" value={form.email}
                        onChange={onChange} required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Message</label>
                      <textarea
                        className="form-control" name="message" rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message} onChange={onChange} required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-2" type="submit">
                        <i className="bi bi-send me-2"></i>Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
