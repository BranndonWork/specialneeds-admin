import React, { useEffect, useRef, useState } from "react";
import config from "@config/config";
import { FacebookIcon, PinterestIcon, EmailIcon, LinkIcon } from "../Shared/Icons";
import AdUnit from "./AdUnit";
import ArticleMetadata from "./ArticleMetadata";
import Author from "./Author";
import TableOfContents from "./TableOfContents";
import replaceTextWithLinks from "./replaceTextWithLinks";
import { addLinksToText } from "../../utils/textHelpers";

const Content = ({ article }) => {
  const contentRef = useRef(null);
  const [processedHtml, setProcessedHtml] = useState(article.article_data.content);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => { setShareUrl(window.location.href); }, []);

  const makeContentReplacements = (content) => {
    content = addLinksToText(content);
    content = replaceTextWithLinks(content);
    content = content.replace(/h1>/g, "h2>");
    content = content.replace(/http:/g, "https:");
    return content;
  };

  useEffect(() => {
    setProcessedHtml(makeContentReplacements(article.article_data.content));
  }, [article]);

  const getReadingMinutes = (content) => {
    if (!content) return null;
    const text = content.replace(/<[^>]+>/g, " ");
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / 180);
    return minutes >= 1 ? minutes : null;
  };

  return (
    <div className="article-content">
      <h2 className="article-title">{article?.article_data?.title}</h2>
      <Author article={article} />
      <ArticleMetadata article={article} readingMinutes={getReadingMinutes(article?.article_data?.content)} />
      {article.article_data.article_type === 'sponsored' && article.article_data.disclosure_label && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '6px', padding: '0.5rem 0.875rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#854d0e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="bx bx-info-circle" style={{ fontSize: '1rem', flexShrink: 0 }} />
          {article.article_data.disclosure_label}
        </div>
      )}
      {/* Share icons — header */}
      <div className="article-share-icons">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><FacebookIcon /></a>
        <a href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${encodeURIComponent(article?.article_data?.title || "")}`} target="_blank" rel="noreferrer" aria-label="Share on Pinterest"><PinterestIcon /></a>
        <a href={`mailto:?subject=${encodeURIComponent((article?.article_data?.title || "") + " - SpecialNeeds.com")}&body=${encodeURIComponent((article?.article_data?.title || "") + " — " + shareUrl)}`} aria-label="Email this article"><EmailIcon /></a>
        <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }} aria-label="Copy link"><LinkIcon /></button>
      </div>
      <TableOfContents contentRef={contentRef} processedHtml={processedHtml} />
      {processedHtml.split("</p>").filter((s) => s.trim()).length < 4 ? (
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      ) : (
        <div ref={contentRef}>
          {processedHtml.split("</p>").filter((s) => s.trim()).map((seg, i, arr) => {
            const secondAdIndex = Math.min(19, arr.length - 1);
            return (
              <React.Fragment key={i}>
                <div dangerouslySetInnerHTML={{ __html: seg + "</p>" }} />
                {i === 2 && <AdUnit slot="in_content_article" />}
                {i === secondAdIndex && i !== 2 && <AdUnit slot="in_content_article" />}
              </React.Fragment>
            );
          })}
        </div>
      )}
      {/* Was this helpful? — gated by NEXT_PUBLIC_ARTICLE_FEEDBACK_ENABLED */}
      {config.articleFeedbackEnabled && (
        <div className="article-helpful">
          <p>Was this article helpful?</p>
          <div className="article-helpful-buttons">
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
      )}

      {/* Social sharing — bottom */}
      <p className="article-share-label">Share</p>
      <div className="article-share-buttons">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer"><FacebookIcon /> Facebook</a>
        <a href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${encodeURIComponent(article?.article_data?.title || "")}`} target="_blank" rel="noreferrer"><PinterestIcon /> Pinterest</a>
        <a href={`mailto:?subject=${encodeURIComponent((article?.article_data?.title || "") + " - SpecialNeeds.com")}&body=${encodeURIComponent((article?.article_data?.title || "") + " — " + shareUrl)}`}><EmailIcon /> Email</a>
        <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }}><LinkIcon /> Copy link</button>
      </div>
    </div>
  );
};

export default Content;
