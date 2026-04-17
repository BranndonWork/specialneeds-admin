import Link from "next/link";

const userPageEnabled = false;

const Author = ({ article }) => {
  const author = article?.article_data?.author;
  if (!author) return null;

  const isVirtualAuthor =
    author?.role === "virtual_author" || author?.slug?.includes("/virtual-authors/");

  const renderAuthorName = () => {
    if (isVirtualAuthor) {
      return (
        <Link href={`/${author.slug.replace("/user/", "/virtual-authors/").replace(/^\//, "")}`} rel="author">
          {author.displayname}
        </Link>
      );
    }
    return userPageEnabled && author.slug ? (
      <Link href={author.slug} rel="author">
        {author.displayname}
      </Link>
    ) : (
      <span>{author.displayname}</span>
    );
  };

  return (
    <address className="article-author-line">
      <span className="by-prefix">By</span>
      {renderAuthorName()}
      {isVirtualAuthor && (
        <>
          <span className="separator" aria-hidden="true">·</span>
          <Link href="/virtual-authors/">
            Virtual Author
          </Link>
        </>
      )}
      <style jsx>{`
        .article-author-line {
          font-style: normal;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0 0 14px;
          color: #666;
        }
        .separator {
          color: #bbb;
          line-height: 1;
        }
        .article-author-line a {
          color: var(--mainColor);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
        }
        .article-author-line a:hover {
          text-decoration: underline;
        }
      `}</style>
    </address>
  );
};


export default Author;
