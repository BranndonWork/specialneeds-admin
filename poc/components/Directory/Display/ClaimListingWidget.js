import { useState } from 'react';
import ClaimListingModal from './ClaimListingModal';

const ClaimListingWidget = ({ listing, accentColor }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div style={{
        border: `1.5px dashed ${accentColor}55`,
        borderRadius: '12px',
        padding: '1.25rem',
        background: '#fafaf8',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '0.5rem' }}>
          Is this your business?
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#6b5e4e', lineHeight: '1.5', margin: '0 0 1rem' }}>
          Claim this listing to manage your profile and respond to inquiries.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            width: '100%',
            background: 'transparent',
            border: `2px solid ${accentColor}`,
            color: accentColor,
            borderRadius: '8px',
            padding: '0.625rem',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Claim This Listing
        </button>
      </div>

      {modalOpen && (
        <ClaimListingModal
          listing={listing}
          accentColor={accentColor}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default ClaimListingWidget;
