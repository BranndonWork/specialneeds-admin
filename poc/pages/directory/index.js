import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '@components/_App/Navbar';
import Footer from '@components/_App/Footer';
import HTMLHeaderMetaData from '@components/_App/HTMLHeaderMetaData';
import { serveAsset } from '@utils/assetHelpers';
import { getCategoryMeta, getActiveSubCategories, NATIONWIDE } from '@components/GuidedSearch/searchUtils';
import StepNav from '@components/GuidedSearch/StepNav';
import StepCategoryPicker from '@components/GuidedSearch/StepCategoryPicker';
import StepSubCategoryPicker from '@components/GuidedSearch/StepSubCategoryPicker';
import StepLocationPicker from '@components/GuidedSearch/StepLocationPicker';
import StepResults from '@components/GuidedSearch/StepResults';

// ─── Location persistence helpers ────────────────────────────────────────────
function loadSavedLocation() {
  try {
    const raw = localStorage.getItem('sn_last_location');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocation(label, lat, lon, radius) {
  try {
    localStorage.setItem('sn_last_location', JSON.stringify({ label, lat, lon, radius, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

// ─── Step derivation from query params (no ?step= in URLs) ───────────────────
// Breadcrumb-compatible: ?category=education → step 2, ?category=education&sub_category=schools → step 3
// Sentinel values: sub_category=all (user picked "All [Category]"), radius=nationwide (no location or no filter)
// use_location=true (no lat/lon) → step 3, but awaitingLocationPrompt intercepts before StepLocationPicker
function deriveStep(query) {
  if (!query.category) return 1;
  if (!query.sub_category) return 2;
  if ((query.lat && query.lon) || query.radius === 'nationwide') return 4;
  return 3;
}

// Truncate coordinate to 2 decimal places (~1km precision — enough for directory search)
const truncCoord = (val) => Math.round(parseFloat(val) * 100) / 100;

const DirectorySearch = () => {
  const router = useRouter();

  // ── All persistent state lives in the URL ────────────────────────────────
  const step = router.isReady ? deriveStep(router.query) : 1;
  const selectedCategory = router.query.category || null;
  const selectedSubCategory = router.query.sub_category || null; // 'all' | slug | null
  const locationLabel = router.query.location || '';
  const coords = (router.query.lat && router.query.lon)
    ? { lat: parseFloat(router.query.lat), lon: parseFloat(router.query.lon) }
    : null;
  // 'nationwide' | numeric string (e.g. '25') | defaults to 'nationwide' when absent
  const radius = router.query.radius || 'nationwide';
  const filterQ = router.query.q || '';
  const pageNumber = parseInt(router.query.pageNumber, 10) || 1;

  // use_location=true with no coords: show location permission prompt, block results fetch
  const awaitingLocationPrompt = router.isReady && router.query.use_location === 'true' && !router.query.lat && !router.query.lon;

  // ── Local UI state ────────────────────────────────────────────────────────
  const [locationInput, setLocationInput] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [sliderRadius, setSliderRadius] = useState(NATIONWIDE);
  const [localCoords, setLocalCoords] = useState(null);
  const [geocodeError, setGeocodeError] = useState('');
  const [locationPromptReady, setLocationPromptReady] = useState(false);
  const [results, setResults] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Sync local state from URL when router is ready or back button fires
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.location) setLocationInput(router.query.location);
    if (router.query.q) setFilterInput(router.query.q);
    setSliderRadius(router.query.radius === 'nationwide' ? NATIONWIDE : (parseInt(router.query.radius) || NATIONWIDE));
  }, [router.isReady, router.query.radius, router.query.location, router.query.q]);

  // If arriving via use_location=true and we have a saved location, skip the prompt and go straight to results
  useEffect(() => {
    if (!router.isReady || !awaitingLocationPrompt) return;
    const saved = loadSavedLocation();
    if (saved?.lat && saved?.lon) {
      pushStep({
        category: selectedCategory,
        sub_category: selectedSubCategory,
        lat: truncCoord(saved.lat),
        lon: truncCoord(saved.lon),
        radius: saved.radius && saved.radius < NATIONWIDE ? saved.radius : NATIONWIDE,
      });
    } else {
      setLocationPromptReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, awaitingLocationPrompt]);

  // Pre-fill location from localStorage when arriving at step 3 with no URL location
  useEffect(() => {
    if (!router.isReady || step !== 3 || router.query.location) return;
    const saved = loadSavedLocation();
    if (!saved) return;
    if (saved.label) setLocationInput(saved.label);
    if (saved.lat && saved.lon) setLocalCoords({ lat: saved.lat, lon: saved.lon });
    if (saved.radius) setSliderRadius(saved.radius);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, step]);

  // Fetch results whenever step 4 params change
  const coordsKey = coords ? `${coords.lat},${coords.lon}` : 'none';
  useEffect(() => {
    if (!router.isReady || step !== 4) return;
    const doFetch = async () => {
      setIsLoading(true);
      try {
        const params = { index: 'listings', perPage: 20, pageNumber };
        if (filterQ) params.q = filterQ;
        if (selectedCategory) params.category = selectedCategory;
        // 'all' means no sub_category filter — show everything in the parent category
        if (selectedSubCategory && selectedSubCategory !== 'all') params.sub_category = selectedSubCategory;
        // If coords exist, pass them (API decides whether to filter or just sort based on radius)
        if (coords) {
          params.lat = coords.lat;
          params.lon = coords.lon;
          params.radius = radius;
        }
        const { data } = await axios.get('/api/v1/search/', { params });
        setResults(data.results || []);
        setTotalHits(data.totalHits || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    doFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, step, selectedCategory, selectedSubCategory, coordsKey, radius, filterQ, pageNumber]);

  const pushStep = (query) =>
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });

  const handleCategorySelect = (slug) => {
    pushStep({ category: slug });
  };

  const handleSubCategorySelect = (subSlug) => {
    // 'all' sentinel preserves sub_category in URL so step derivation reaches step 3 (location)
    pushStep({ category: selectedCategory, sub_category: subSlug || 'all' });
  };

  const handleLocationContinue = async () => {
    setGeocodeError('');
    // No location input — nationwide with no geo at all
    if (!locationInput.trim()) {
      pushStep({ category: selectedCategory, sub_category: selectedSubCategory, radius: 'nationwide' });
      return;
    }
    const resolvedRadius = sliderRadius >= NATIONWIDE ? 'nationwide' : sliderRadius;
    // Has location from geolocation
    if (localCoords) {
      saveLocation(locationInput.trim(), localCoords.lat, localCoords.lon, sliderRadius);
      // Omit location label from URL when using device geolocation — lat/lon is sufficient
      pushStep({
        category: selectedCategory,
        sub_category: selectedSubCategory,
        lat: truncCoord(localCoords.lat),
        lon: truncCoord(localCoords.lon),
        radius: resolvedRadius,
      });
      return;
    }
    // Need to geocode first
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/geocode/', { params: { q: locationInput.trim() } });
      const resolved = { lat: res.data.lat, lon: res.data.lon };
      saveLocation(locationInput.trim(), resolved.lat, resolved.lon, sliderRadius);
      pushStep({
        category: selectedCategory,
        sub_category: selectedSubCategory,
        location: locationInput.trim(),
        lat: truncCoord(resolved.lat),
        lon: truncCoord(resolved.lon),
        radius: resolvedRadius,
      });
      // isLoading reset by fetch useEffect
    } catch (err) {
      if (err.response?.status === 404) {
        setGeocodeError('Location not found. Try a city name, state, or zip code.');
      } else {
        setGeocodeError('Could not look up that location. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeocodeError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationInput('Your current location');
      },
      () => setGeocodeError('Could not access your location. Please enter it manually.')
    );
  };

  const clearGeoMode = () => {
    setLocalCoords(null);
    setLocationInput('');
    setGeocodeError('');
  };

  const handleLocationPromptYes = () => {
    if (!navigator.geolocation) {
      pushStep({ category: selectedCategory, sub_category: selectedSubCategory, radius: 'nationwide' });
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLoading(false);
        pushStep({
          category: selectedCategory,
          sub_category: selectedSubCategory,
          lat: truncCoord(pos.coords.latitude),
          lon: truncCoord(pos.coords.longitude),
          radius: NATIONWIDE,
        });
      },
      () => {
        setIsLoading(false);
        pushStep({ category: selectedCategory, sub_category: selectedSubCategory, radius: 'nationwide' });
      }
    );
  };

  const startOver = () => {
    setLocalCoords(null);
    setLocationInput('');
    setGeocodeError('');
    router.push({ pathname: router.pathname }, undefined, { shallow: true });
  };

  const goBack = () => router.back();

  const catMeta = selectedCategory ? getCategoryMeta(selectedCategory) : null;
  const subCats = selectedCategory ? getActiveSubCategories(selectedCategory) : [];
  const defaultThumbnail = serveAsset('missingFeaturedImage');

  return (
    <>
      <HTMLHeaderMetaData
        title="Find Special Needs Services"
        description="Search for special needs schools, therapists, camps, and other services near you."
        additionalMeta={[{ name: 'robots', content: 'noindex, follow' }]}
      />
      <Navbar />

      <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', paddingTop: '80px' }}>
        <StepNav
          step={step}
          catMeta={catMeta}
          onBack={goBack}
          onStartOver={startOver}
          hasResults={results.length > 0}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          {step === 1 && <StepCategoryPicker onSelect={handleCategorySelect} />}

          {step === 2 && catMeta && (
            <StepSubCategoryPicker
              categorySlug={selectedCategory}
              catMeta={catMeta}
              onSelect={handleSubCategorySelect}
            />
          )}

          {step === 3 && catMeta && awaitingLocationPrompt && locationPromptReady && (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Find {catMeta.label} near you?
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                Share your location to see results closest to you, or browse all listings nationwide.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handleLocationPromptYes}
                  disabled={isLoading}
                  style={{
                    backgroundColor: catMeta.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.85rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'wait' : 'pointer',
                    width: '100%',
                    maxWidth: '320px',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Getting location…' : 'Use my location'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && catMeta && !awaitingLocationPrompt && (
            <StepLocationPicker
              catMeta={catMeta}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              localCoords={localCoords}
              sliderRadius={sliderRadius}
              setSliderRadius={setSliderRadius}
              geocodeError={geocodeError}
              setGeocodeError={setGeocodeError}
              isLoading={isLoading}
              onContinue={handleLocationContinue}
              onUseMyLocation={handleUseMyLocation}
              onClearGeo={clearGeoMode}
            />
          )}

          {step === 4 && (
            <StepResults
              catMeta={catMeta}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              subCats={subCats}
              coords={coords}
              locationLabel={locationLabel}
              radius={radius}
              filterQ={filterQ}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              isLoading={isLoading}
              results={results}
              totalHits={totalHits}
              totalPages={totalPages}
              defaultThumbnail={defaultThumbnail}
              pushStep={pushStep}
              router={router}
              startOver={startOver}
            />
          )}

        </div>
      </div>

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

export default DirectorySearch;
