import Autolinker from "autolinker";
import DOMPurify from "dompurify";
import striptags from "striptags";

export const toSnakeCase = (str) => {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
};

export const caseInsensitiveCompare = (a, b) => toSnakeCase(a) === toSnakeCase(b);

export const snakeCaseToTitleCase = (str) => {
  if (!str) return "";
  return str
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

export const splitLinesAfter = (str, n, concat = "<br />") => {
  return str
    .match(new RegExp(`(.{1,${n}})(\\s+|$)`, "g"))
    .join(concat)
    .trim();
};

export const toTitleCase = (
  words,
  keepLower = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "as",
    "at",
    "by",
    "for",
    "from",
    "in",
    "into",
    "near",
    "of",
    "on",
    "onto",
    "to",
    "with",
  ],
  forceUpper = ["id", "faq", "tv"]
) => {
  keepLower = new Set(keepLower);
  forceUpper = new Set(forceUpper);

  return words.replace(/\w+/g, (word, i) => {
    word = word.toLowerCase();

    if (i && keepLower.has(word)) {
      return word;
    }
    if (forceUpper.has(word)) {
      return word.toUpperCase();
    }

    return word[0].toUpperCase() + word.slice(1);
  });
};

export const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export const camelCaseToTitleCase = (camelCase) => {
  if (!camelCase) return camelCase;
  if (typeof camelCase !== "string") return camelCase;
  if (camelCase.indexOf(" ") !== -1) return camelCase;
  if (camelCase.length === 1) return camelCase.toUpperCase();
  if (camelCase.length === 2) return camelCase[0].toUpperCase() + camelCase[1].toLowerCase();
  return camelCase.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
};

export const stripHTML = (html) => {
  if (html?.constructor === Object) {
    for (var key in html) {
      html[key] = stripHTML(html[key]);
    }
    return html;
  }
  if (typeof html !== "string") return html;

  // replace <em> tags with parentheses ()
  html = html.replace(/<em>/g, "(");
  html = html.replace(/<\/em>/g, ")");

  // add spaces between every tag
  html = html.replace(/(<([^>]+)>)/gi, " ");

  // Use striptags to remove all HTML tags
  let output = striptags(html);

  // replace multiple spaces with a single space
  output = output.replace(/\s\s+/g, " ");
  // trim preceding spaces only, leave the trailing spaces
  output = output.replace(/^\s+/, "");

  return output;
};

export const removeHtmlElements = (html, allowedElements = []) => {
  if (typeof html !== "string") return html;
  if (allowedElements.length === 0) return html;
  if (!html) return html;
  if (!html.match(/<\/?[a-z][\s\S]*>/gi)) return html;
  if (typeof allowedElements !== "object") return html;

  // if the last part of the html is <p></p>
  const newParagraph = "<p><br></p>";
  let lastPart = html.slice(html.length - newParagraph.length);
  let addNewParagraph = false;
  if (lastPart == newParagraph) {
    addNewParagraph = true;
  }

  for (let i = 0; i < allowedElements.length; i++) {
    let thisElement = allowedElements[i];
    let regex = new RegExp(`</?${thisElement}[^>]*>`, "gi");
    html = html.replace(regex, "");
  }

  // catch <br> tags
  html = html.replace(/<br>/gi, "");

  // remove tags without any attributes and content
  html = html.replace(/<[^>]*><\/[^>]*>/gi, "");

  if (lastPart == newParagraph || addNewParagraph) {
    html = html + newParagraph;
  }

  // returns the html with all unwanted elements removed
  return html;
};

export const sanitizeHtml = (html, allowedTags = []) => {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags });
};

export const addLinksToText = (html) => {
  if (!html) return html;

  return Autolinker.link(html, {
    urls: true,
    email: false,
    phone: true,
    mention: false,
    hashtag: false,
    newWindow: true,
  });
};

export const wordIsMixedCase = (word) =>
  typeof word === "string" &&
  word.length > 1 &&
  word.toLowerCase() !== word &&
  word.toUpperCase() !== word;

export const isPascalCase = (word) => wordIsMixedCase(word) && word[0] === word[0].toUpperCase();

export const isCamelCase = (word) => wordIsMixedCase(word) && word[0] === word[0].toLowerCase();

export const toKebabCase = (str) => {
  if (typeof str !== "string" || !str.trim()) return "";
  str = str.replace(/[^a-z0-9\s]/gi, "-");
  str = str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  str = str.replace(/\s+/g, "-");
  return str.replace(/-+/g, "-").replace(/^-|-$/g, "");
};
