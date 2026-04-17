import {
  getPopularDirectoryCategories,
  getPopularArticles,
  getPopularListings,
  getPopularNews,
} from "@pages/api/v1/search/getPopular";

export const useGetPopular = ({ router }) => {
  const popularCategories = async (limit, context) => {
    const categories = await getPopularDirectoryCategories();
    return categories;
  };

  const popularListings = async (limit = 10, context) => {
    const listings = await getPopularListings(limit);
    return listings;
  };

  const popularArticles = async (limit = 10, context) => {
    const articles = await getPopularArticles(limit);
    return articles;
  };

  const popularNews = async (limit = 10, context) => {
    const news = await getPopularNews(10);
    return news;
  };

  return {
    popularCategories,
    popularListings,
    popularArticles,
    popularNews,
  };
};
