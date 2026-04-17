import Link from "next/link";
const Tags = ({ article }) => {
  const displayTags = () => {
    if (article?.article_data?.tags?.length === 0 || !article?.article_data?.tags) {
      return [];
    }
    return article?.article_data?.tags.map((tag, index) => {
      let query = encodeURIComponent(tag).replace(/%20/g, "+");
      return (
        <Link key={index} href={`/articles/?q=${query}`}>
          {tag}
        </Link>
      );
    });
  };

  return (
    <div className="article-footer tagcloud">
      {displayTags().length > 0 && (
        <div className="article-tags">
          <span>
            <i className="bx bx-purchase-tag"></i>{" "}
          </span>
          Topics Covered in this Article
          <br />
          {displayTags()}
        </div>
      )}
    </div>
  );
};


export default Tags;
