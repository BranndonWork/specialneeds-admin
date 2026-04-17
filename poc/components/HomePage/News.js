import {useTranslations} from 'next-intl';

import displayArticles from "./displayArticles";
const News = ({ articles }) => {
  const t = useTranslations('descriptions');

  if (!articles || !Array.isArray(articles)) return null;

  return (
    <>
      <section className={`destinations-area  pt-100`} style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container">
          <div className="section-title">
            <h2>{t('recentNews.title')}</h2>
            <p>{t('recentNews.description')}</p>
          </div>
          {displayArticles(articles)}
        </div>
      </section>
    </>
  );
};


export default News;
