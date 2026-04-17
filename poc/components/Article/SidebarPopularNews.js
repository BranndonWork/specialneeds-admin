// import cache from "@utils/cache";
import { getArticleImage } from "@utils/articles/getArticleImage";
import Link from "next/link";
import Image from "next/image";

const SidebarPopularNews = ({ articles }) => {
  const getArticleDate = (article) => {
    const date = new Date(article.published_at_timestamp * 1000);
    // display as June 30, 2020
    return `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (!articles || !Array.isArray(articles) || articles.length === 0) return null;

  return (
    <section className="widget widget_miran_posts_thumb" id="popular-articles-sidebar">
      <h3 className="widget-title">Popular News</h3>
      {articles.map((article) => {
        const articleData = article.article_data || article;
        const image = getArticleImage(articleData, 500);
        return (
          <Link href={`/articles/${articleData.slug}`} key={articleData.slug}>
            <article className="item">
              <span className="thumb">
                <div className="image-container">
                  <Image src={image} alt={articleData.title} width={100} height={80} />
                </div>
              </span>
              <div className="info">
                <span>{getArticleDate(articleData)}</span>
                <h4 className="title usmall">{articleData.title}</h4>
              </div>

              <div className="clear"></div>
            </article>
          </Link>
        );
      })}
    </section>
  );
};


export default SidebarPopularNews;
