import { NATIONWIDE } from './searchUtils';
import { headingStyle, subheadStyle, locationInputStyle, primaryBtnStyle, secondaryBtnStyle, geoLockedStyle, clearGeoBtnStyle } from './styles';

/**
 * Step 3 — Location picker with radius slider.
 * Supports manual text entry, geolocation, and radius selection.
 */
const StepLocationPicker = ({
  catMeta,
  locationInput,
  setLocationInput,
  localCoords,
  sliderRadius,
  setSliderRadius,
  geocodeError,
  setGeocodeError,
  isLoading,
  onContinue,
  onUseMyLocation,
  onClearGeo,
}) => {
  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>
        {catMeta.icon}
      </span>
      <h1 style={headingStyle}>Where are you located?</h1>
      <p style={subheadStyle}>
        We&apos;ll show {catMeta.label.toLowerCase()} services near you first.
      </p>

      <div style={{ marginTop: '2rem' }}>
        {localCoords ? (
          <div style={geoLockedStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: '500' }}>
              <span>📍</span>
              <span>{locationInput || 'Your current location'}</span>
            </span>
            <button onClick={onClearGeo} style={clearGeoBtnStyle} aria-label="Clear location">
              ✕
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setGeocodeError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && onContinue()}
              placeholder="City, state, or zip code"
              style={{ ...locationInputStyle, borderColor: geocodeError ? '#ef4444' : '#e2e8f0' }}
              autoFocus
            />
            {geocodeError && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'left' }}>
                {geocodeError}
              </p>
            )}
            <button onClick={onUseMyLocation} style={secondaryBtnStyle}>
              📍 Use my location
            </button>
          </>
        )}

        {/* Radius slider */}
        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
            Search radius: <span style={{ color: catMeta.color }}>
              {sliderRadius >= NATIONWIDE ? 'Nationwide' : `${sliderRadius} miles`}
            </span>
          </label>
          <input
            type="range"
            min={5}
            max={1000}
            step={5}
            value={sliderRadius}
            onChange={(e) => setSliderRadius(Number(e.target.value))}
            style={{ width: '100%', accentColor: catMeta.color }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            <span>5 mi</span>
            <span>Nationwide</span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onContinue}
            disabled={isLoading}
            style={{ ...primaryBtnStyle, backgroundColor: catMeta.color, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Finding location...' : 'Show Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepLocationPicker;
