import { useState, useEffect } from 'react';

const useAd = (slot, options = {}) => {
  const { category = null, pageUrl = null } = options;
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams({ slot });
    if (category) params.set('category', category);
    if (pageUrl) params.set('page_url', pageUrl);

    fetch(`/api/ads?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAd(data?.ad ?? null))
      .catch(() => setAd(null));
  }, [slot, category, pageUrl]);

  return ad;
};

export default useAd;
