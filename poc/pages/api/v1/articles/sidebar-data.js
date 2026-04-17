import buildEndpoint from "@utils/server/api/buildEndpoint";

export default async function handler(req, res) {
  const [articlesRes, categoriesRes, tagsRes] = await Promise.allSettled([
    fetch(buildEndpoint('/articles/popular/articles/?limit=5')).then(r => r.json()),
    fetch(buildEndpoint('/articles/popular/categories/')).then(r => r.json()),
    fetch(buildEndpoint('/articles/popular/tags/?limit=10')).then(r => r.json()),
  ]);

  const data = {
    popularArticles: articlesRes.status === 'fulfilled' ? (articlesRes.value?.articles || []) : [],
    popularCategories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.categories || []) : [],
    popularTags: tagsRes.status === 'fulfilled' ? (tagsRes.value?.tags || []) : [],
  };

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(data);
}
