// ResultCard.js
import config from "@config/config";
import { serveAsset } from "@utils/assetHelpers";
import Image from "next/image";
import { useState } from "react";

const Location = ({ result }) => {
  if (!result?.state_province) return null;
  return (
    <div className="location">
      {result.city && <span className="city">{result.city}, </span>}
      <span className="state">{result.state_province}</span>
      {result.distance && (
        <p className="distance" style={{ fontSize: "0.8em", color: "#666", marginTop: "-2px" }}>
          {result.distance}
        </p>
      )}
    </div>
  );
};

const Author = ({ result }) => {
  if (!result?.author_name) return null;
  return <span className="author">By {result.author_name}</span>;
};

const SearchResultCard = ({ result }) => {
  const defaultThumbnail = serveAsset("missingFeaturedImage");
  const [imageError, setImageError] = useState(false);
  let urlBase = "";

  if (typeof window !== "undefined") {
    urlBase = window.location.pathname;
  }

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "");

  const truncateHTML = (html, maxLength) => {
    // Extract plain text to check if truncation is needed
    const fullText = stripHtml(html);

    if (fullText.length <= maxLength) return html;

    // Find all <em> tags and their positions
    const emRegex = /<em[^>]*>(.*?)<\/em>/gi;
    const matches = [];
    let match;

    while ((match = emRegex.exec(html)) !== null) {
      // Get text position, not HTML position
      const beforeHTML = html.substring(0, match.index);
      const textPosition = stripHtml(beforeHTML).length;

      matches.push({
        text: match[1],
        position: textPosition,
        length: match[1].length,
      });
    }

    if (matches.length === 0) {
      // No highlights, just truncate normally
      return truncateText(fullText, maxLength);
    }

    // Calculate context per highlight
    const totalHighlightLength = matches.reduce((sum, m) => sum + m.length, 0);
    const remainingLength = maxLength - totalHighlightLength;
    const contextPerHighlight = Math.floor(remainingLength / matches.length);

    // Extract snippets around each highlight
    const snippets = matches.map((m, index) => {
      const before = Math.floor(contextPerHighlight / 2);
      const after = contextPerHighlight - before;

      let startPos = Math.max(0, m.position - before);
      let endPos = Math.min(fullText.length, m.position + m.length + after);

      // Find word boundaries
      if (startPos > 0) {
        // Look backwards for the start of the word or space
        while (startPos > 0 && fullText[startPos - 1] !== " " && fullText[startPos - 1] !== "\n") {
          startPos--;
        }
      }

      if (endPos < fullText.length) {
        // Look forwards for the end of the word or space
        while (endPos < fullText.length && fullText[endPos] !== " " && fullText[endPos] !== "\n") {
          endPos++;
        }
      }

      let snippet = fullText.substring(startPos, endPos).trim();

      // Re-highlight the match in this snippet
      const matchInSnippet = m.text;
      const matchIndex = snippet.toLowerCase().indexOf(matchInSnippet.toLowerCase());

      if (matchIndex === -1) {
        return snippet; // Fallback if we can't find it
      }

      const beforeText = snippet.substring(0, matchIndex);
      const afterText = snippet.substring(matchIndex + matchInSnippet.length);

      let result = beforeText + "<em>" + matchInSnippet + "</em>" + afterText;

      // Add ellipsis if not at start/end
      if (startPos > 0) result = "..." + result;
      if (endPos < fullText.length) result = result + "...";

      return result;
    });

    // Join snippets and clean up consecutive ellipses
    return snippets.join(" ").replace(/\.\.\.\s+\.\.\./g, "...");
  };

  const styledSnippet = (snippet) =>
    snippet.replace(/<em>/g, '<em style="background-color: #10c6c530;font-weight:strong">');

  const thumbnail = result.thumbnail?.trim();
  const imageSrc = imageError || !thumbnail ? defaultThumbnail : thumbnail;

  return (
    <a href={`${urlBase}${result.slug}/`} className="result-card" key={result.objectID}>
      <div className="thumbnail" data-category={result.category_name}>
        <Image
          src={imageSrc}
          alt={result.title}
          width={256}
          height={192}
          style={{ objectFit: "cover", objectPosition: "center" }}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="details">
        <div className="category-large">{result.category_name}</div>
        <h2 className="title">{result.title}</h2>
        <Author result={result} />
        <Location result={result} />
        {result._snippetResult &&
        result._snippetResult.content.value &&
        result._snippetResult.content.matchLevel !== "none" ? (
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: styledSnippet(truncateHTML(result._snippetResult.content.value, 300)),
            }}
          ></div>
        ) : (
          <p className="content">{result.summary || truncateText(result.content || "", 300)}</p>
        )}
      </div>
    </a>
  );
};

export default SearchResultCard;
