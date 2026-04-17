import React from 'react';
import { locationInputStyle, primaryBtnStyle, filterChipStyle } from './styles';
import ResultCard from './ResultCard';
import AdUnit from '@components/Article/AdUnit';
import Pagination from './Pagination';

/**
 * Step 4 — Results display with header, filter chips, keyword search, and result list.
 */
const StepResults = ({
  catMeta,
  selectedCategory,
  selectedSubCategory,
  subCats,
  coords,
  locationLabel,
  radius,
  filterQ,
  filterInput,
  setFilterInput,
  isLoading,
  results,
  totalHits,
  totalPages,
  defaultThumbnail,
  pushStep,
  router,
  startOver,
}) => {
  return (
    <div>
      {/* Results header */}
      <div style={{ marginBottom: '1.5rem' }}>
        {catMeta && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{catMeta.icon}</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
              {catMeta.label}
              {selectedSubCategory && selectedSubCategory !== 'all' && (() => {
                const sub = subCats.find((s) => s.slug === selectedSubCategory);
                return sub ? <span style={{ color: catMeta.color }}>{' / '}{sub.label}</span> : null;
              })()}
            </h1>
          </div>
        )}

        {/* Filter chips */}
        {catMeta && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {/* Category chip */}
            <button
              onClick={() => pushStep({})}
              style={filterChipStyle(catMeta.color)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${catMeta.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${catMeta.color}12`;
              }}
            >
              <span>{catMeta.icon} {catMeta.label}</span>
              <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>✎</span>
            </button>

            {/* Subcategory chip */}
            {selectedSubCategory && subCats.find((s) => s.slug === selectedSubCategory) && (
              <button
                onClick={() => pushStep({ category: selectedCategory })}
                style={filterChipStyle(catMeta.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}12`;
                }}
              >
                <span>{subCats.find((s) => s.slug === selectedSubCategory)?.label}</span>
                <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>✎</span>
              </button>
            )}

            {/* Location chip */}
            {coords ? (
              <button
                onClick={() => {
                  const query = { category: selectedCategory };
                  if (selectedSubCategory) query.sub_category = selectedSubCategory;
                  pushStep(query);
                }}
                style={filterChipStyle(catMeta.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}12`;
                }}
              >
                <span>
                  📍 {locationLabel || 'your location'} <i className="bx bx-right-arrow-alt" style={{ verticalAlign: 'middle', fontSize: '1.3em' }} /> {radius === 'nationwide' ? 'Nationwide' : `${radius}mi`}
                </span>
                <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>✎</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const query = { category: selectedCategory };
                  if (selectedSubCategory) query.sub_category = selectedSubCategory;
                  pushStep(query);
                }}
                style={filterChipStyle(catMeta.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${catMeta.color}12`;
                }}
              >
                <span>🌐 Nationwide</span>
                <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}>✎</span>
              </button>
            )}
          </div>
        )}

        {!isLoading && (
          <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>
            {totalHits > 0 ? `${totalHits.toLocaleString()} results` : 'Results'}
            {coords
              ? (radius === 'nationwide'
                ? <> sorted by distance from {locationLabel || 'your location'} — nationwide</>
                : <> within {radius} miles of 📍 {locationLabel || 'your location'}</>)
              : ' — nationwide'}
          </p>
        )}
      </div>

      {/* Keyword search */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const query = { ...router.query };
              if (filterInput.trim()) query.q = filterInput.trim();
              else delete query.q;
              delete query.pageNumber;
              pushStep(query);
            }
          }}
          placeholder="Search within results..."
          style={{ ...locationInputStyle, marginBottom: 0, flex: 1 }}
        />
        <button
          onClick={() => {
            const query = { ...router.query };
            if (filterInput.trim()) query.q = filterInput.trim();
            else delete query.q;
            delete query.pageNumber;
            pushStep(query);
          }}
          style={{ ...primaryBtnStyle, padding: '0.875rem 1.25rem', backgroundColor: catMeta ? catMeta.color : '#10c6c5', whiteSpace: 'nowrap' }}
        >
          Search
        </button>
      </div>

      {/* Results list */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '1rem' }}>
          Loading...
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>No results found. Try adjusting your filters.</p>
          <button onClick={startOver} style={{ ...primaryBtnStyle, marginTop: '1.5rem', backgroundColor: catMeta ? catMeta.color : '#10c6c5' }}>
            Start Over
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {results.map((result, index) => (
            <React.Fragment key={result.objectID}>
              <ResultCard result={result} catMeta={catMeta} defaultThumbnail={defaultThumbnail} />
              {index % 5 === 4 && <AdUnit slot="in_feed_directory" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: '2rem' }}>
          <Pagination totalPages={totalPages} totalHits={totalHits} />
        </div>
      )}
    </div>
  );
};

export default StepResults;
