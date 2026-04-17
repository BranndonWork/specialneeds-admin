import { useState, useEffect, useRef } from 'react';

const ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'representative', label: 'Authorized Representative' },
];

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid #d1c8be',
  borderRadius: '6px',
  fontSize: '0.9375rem',
  color: '#2d2416',
  background: '#fff',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: '600',
  color: '#4a3f35',
  marginBottom: '0.375rem',
};

const ClaimListingModal = ({ listing, accentColor, onClose }) => {
  const listingData = listing.listing_data;
  const formRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: '',
    license_number: '',
    npi_number: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | pending | error | captcha_pending

  useEffect(() => {
    import('altcha');
  }, []);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => {
    if (status === 'captcha_pending') setStatus('idle');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const requiredFilled = form.full_name && form.email && form.phone && form.role;
  const canSubmit = requiredFilled && status !== 'submitting';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const fd = new FormData(formRef.current);
    const altchaValue = fd.get('altcha');

    if (!altchaValue) {
      setStatus('captcha_pending');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch(`/api/v1/listings/claim/${listingData.id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, altcha: altchaValue }),
      });

      const data = await res.json();

      if (res.status === 201) setStatus('success');
      else if (data?.status === 'already_pending') setStatus('pending');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,8,5,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px',
        width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflowY: 'auto',
        padding: '2rem', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#6b5e4e', lineHeight: 1 }}
        >
          &times;
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '0.375rem' }}>
            Claim This Listing
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2d2416', margin: 0, lineHeight: 1.2 }}>
            {listingData.title}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#6b5e4e', marginTop: '0.5rem', marginBottom: 0 }}>
            Fill out the form below. Our team will verify your information and follow up within 2 business days.
          </p>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#2d2416', marginBottom: '0.5rem' }}>Claim submitted</div>
            <p style={{ fontSize: '0.875rem', color: '#6b5e4e' }}>
              We&apos;ll review your information and follow up within 2 business days.
            </p>
            {/* PHASE 2: Connect payment here. Replace this block with a redirect:
                window.location.href = `/subscribe?listing_id=${listingData.id}` */}
          </div>
        )}

        {/* Pending (duplicate) state */}
        {status === 'pending' && (
          <div style={{ background: '#fff8f0', border: `1px solid ${accentColor}44`, borderRadius: '8px', padding: '1.25rem', fontSize: '0.875rem', color: '#4a3f35', lineHeight: 1.6 }}>
            We already have a claim pending for this listing. If you submitted previously, sit tight — we&apos;re reviewing it. If you think this is a mistake, please contact us.
          </div>
        )}

        {/* Form */}
        {(status === 'idle' || status === 'submitting' || status === 'error' || status === 'captcha_pending') && (
          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Honeypot */}
            <input name="website_url" type="text" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} autoComplete="off" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div>
                <label style={labelStyle}>Full Name <span style={{ color: accentColor }}>*</span></label>
                <input name="full_name" type="text" required value={form.full_name} onChange={handleChange} style={inputStyle} autoComplete="name" />
              </div>

              <div>
                <label style={labelStyle}>Business Email <span style={{ color: accentColor }}>*</span></label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} autoComplete="email" />
              </div>

              <div>
                <label style={labelStyle}>Business Phone <span style={{ color: accentColor }}>*</span></label>
                <input name="phone" type="tel" required value={form.phone} onChange={handleChange} style={inputStyle} autoComplete="tel" />
              </div>

              <div>
                <label style={labelStyle}>Your Role <span style={{ color: accentColor }}>*</span></label>
                <select name="role" required value={form.role} onChange={handleChange} style={inputStyle}>
                  <option value="">Select a role...</option>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>State License Number <span style={{ color: '#9e8e7e', fontWeight: 400 }}>(optional)</span></label>
                <input name="license_number" type="text" value={form.license_number} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>NPI Number <span style={{ color: '#9e8e7e', fontWeight: 400 }}>(optional, for licensed providers)</span></label>
                <input name="npi_number" type="text" value={form.npi_number} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>How are you connected to this listing? <span style={{ color: '#9e8e7e', fontWeight: 400 }}>(optional)</span></label>
                <textarea name="message" rows={3} value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Altcha widget */}
              <altcha-widget
                challengeurl="/api/v1/captcha/challenge"
                hidefooter="true"
                style={{ display: 'block' }}
              />

              {status === 'captcha_pending' && (
                <div style={{ fontSize: '0.8125rem', color: '#7a5c00', padding: '0.625rem', background: '#fffbea', borderRadius: '6px' }}>
                  Verification is still processing — please wait a moment and try again.
                </div>
              )}
              {status === 'error' && (
                <div style={{ fontSize: '0.8125rem', color: '#c0392b', padding: '0.625rem', background: '#fff5f5', borderRadius: '6px' }}>
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  background: canSubmit ? accentColor : '#c8bdb4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.875rem',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
              >
                {status === 'submitting' ? 'Submitting…' : status === 'captcha_pending' ? 'Try Again' : 'Submit Claim'}
              </button>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClaimListingModal;
