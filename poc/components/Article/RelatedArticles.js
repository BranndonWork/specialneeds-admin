import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
const RelatedArticles = ({ article }) => {
  const [relatedArticles, setRelatedArticles] = useState([]);
  useEffect(() => {
    if (
      article?.relatedArticles &&
      article?.relatedArticles.length > 0 &&
      !relatedArticles?.length
    ) {
      setRelatedArticles(article?.relatedArticles);
    }
  }, [article, relatedArticles?.length]);

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="miran-post-navigation">
      <div className="prev-link-wrapper">
        <div className="info-prev-link-wrapper">
          <Link href={`/articles/${article.related[0].slug}`}>
            <span className="image-prev">
              <Image src={article.related[0].image.url} alt={article.related[0].image.alt} width={150} height={100} />
              <span className="post-nav-title">Read</span>
            </span>

            <span className="prev-link-info-wrapper">
              <span className="prev-title">{article.related[0].title}</span>
              <span className="meta-wrapper">
                <span className="date-post">{article.related[0].postDate}</span>
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="next-link-wrapper">
        <div className="info-next-link-wrapper">
          <Link href={`/articles/${article.related[1].slug}`}>
            <span className="image-next">
              <Image src={article.related[1].image.url} alt={article.related[1].image.alt} width={150} height={100} />
              <span className="post-nav-title">Read</span>
            </span>

            <span className="next-link-info-wrapper">
              <span className="next-title">{article.related[1].title}</span>
              <span className="meta-wrapper">
                <span className="date-post">{article.related[1].postDate}</span>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default RelatedArticles;
