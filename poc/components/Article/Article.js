import EditButton from "../Shared/EditButton";
import HTMLHeaderMetaData from "../_App/HTMLHeaderMetaData";
import Content from "./Content";
import FeaturedImage from "./FeaturedImage";
import ProgressBar from "./ProgressBar";
import RelatedArticles from "./RelatedArticles";
import Sidebar from "./Sidebar";
import Tags from "./Tags";

const Article = ({ article, sidebarData }) => {
  return (
    <>
      <HTMLHeaderMetaData
        title={article.article_data.title}
        author={article.article_data.author?.displayname}
        keywords={article.article_data.tags || []}
        description={article.article_data.summary}
      />
      <ProgressBar />
      <section className="article-details-area bg-f9f9f9 ptb-70 article">
        <div className="container">
          <div className="row">
            <EditButton content={article} />
            <div className="col-lg-8 col-md-12">
              <div className="article-details-desc">
                <FeaturedImage article={article} />
                <Content
                  article={article}
                />
                <Tags article={article} />
                <RelatedArticles article={article} />
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <Sidebar
                article={article}
                sidebarData={sidebarData}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default Article;
