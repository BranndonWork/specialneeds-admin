import ContentLoadingPlaceholder from "@components/Common/ContentLoadingPlaceholder";
import Utils from "@utils";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ArticleMetadataPlaceholder = () => {
  return (
    <>
      <div className="entry-meta">
        <ul>
          <li>
            <i className="bx bx-folder-open"></i>
            <span>Category</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: "19px" }} />
          </li>
          {/* <li>
            <i className="bx bx-group"></i>
            <span>Views</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: '19px' }} />
          </li> */}
          <li>
            <i className="bx bx-calendar"></i>
            <span>Last Updated</span>
            <ContentLoadingPlaceholder styleOverrides={{ height: "19px" }} />
          </li>
        </ul>
      </div>
      <style jsx>{`
        .entry-meta {
          display: flex;
          justify-content: center;
        }

        .entry-meta ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
};

const ArticleMetadata = ({ article, readingMinutes }) => {
  const date = new Date(article?.article_data?.updated_at || article?.article_data?.published_at);
  const dateString = date.toLocaleDateString();
  const dateParts = dateString.split("/");
  const newDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  const formattedDate = newDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const outdatedInfo = () => {
    try {
      const lastUpdated = new Date(formattedDate);
      // if it's more than 1 year ago, add an icon to indicate it's old
      if (new Date().getFullYear() - lastUpdated.getFullYear() > 1) {
        return (
          <>
            <Tooltip anchorId="OutdatedArticle" />
            <div
              style={{ color: "#cfcfcf", marginLeft: "5px" }}
              className="d-inline-block"
              id="OutdatedArticle"
              data-tooltip-html={Utils.splitLinesAfter(
                "The content was last updated over a year ago and may be outdated. Please contact us if you have any questions.",
                42
              )}
            >
              <i className="bx bxs-help-circle"></i>
            </div>
          </>
        );
      }
    } catch (e) {}
    return null;
  };

  const displayViewCount = () => {
    if (article?.article_data?.view_count > 0) {
      let viewCount = article?.article_data?.view_count;
      // add commas to view count
      return viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return 0;
  };

  if (!article?.article_data?.title) {
    return <ArticleMetadataPlaceholder />;
  }

  const renderCategory = () => {
    const category = article?.article_data?.category;
    if (!category) return null;

    // Check if this category has a parent (sub-category case)
    if (category.parent && category.parent.slug && category.parent.name) {
      // Extract just the child slug from the full path
      // e.g., "special-needs/autism-spectrum" -> "autism-spectrum"
      const childSlug = category.slug.includes('/')
        ? category.slug.split('/').pop()
        : category.slug;

      return (
        <>
          <a href={`/articles/?category=${category.parent.slug}`}>
            {category.parent.name}
          </a>
          {" > "}
          <a
            href={`/articles/?category=${category.parent.slug}&sub_category=${childSlug}`}
            className="child-category"
          >
            {category.name}
          </a>
        </>
      );
    }

    // Top-level category (no parent)
    return (
      <a href={`/articles/?category=${category.slug}`}>
        {category.name}
      </a>
    );
  };

  return (
    <>
      <div className="entry-meta">
        <ul>
          <li className="category">
            <i className="bx bx-folder-open"></i>
            <span>Category</span>
            {renderCategory()}
          </li>
          {/* <li>
            <i className="bx bx-group"></i>
            <span>Views</span>
            {displayViewCount()}
          </li> */}
          <li className="last-updated">
            <i className="bx bx-calendar"></i>
            <span>Last Updated</span>
            {formattedDate}
            {outdatedInfo()}
          </li>
          {readingMinutes && (
            <li className="read-time">
              <i className="bx bx-time"></i>
              <span>Read Time</span>
              {readingMinutes} min
            </li>
          )}
        </ul>
      </div>
      <style jsx>{`
        .entry-meta {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 20px;
          padding: 0 10px;
          color: #333;
        }

        .entry-meta ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          width: 100%;
        }
        .entry-meta ul li {
          padding-right: 0;
          border: none;
          font-size: 1rem;
        }

        .entry-meta ul li.category {
          font-weight: bold;
        }

        .entry-meta ul li.category .child-category {
          display: inline-block;
        }

        .entry-meta ul li.last-updated {
          white-space: nowrap;
        }

        .entry-meta ul li.read-time {
          white-space: nowrap;
          color: var(--optionalColor);
        }

        .entry-meta .icon {
          font-size: 1.2rem;
          margin-right: 5px;
        }
      `}</style>
    </>
  );
};
export default ArticleMetadata;
