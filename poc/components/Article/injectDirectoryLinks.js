const injectDirectoryLinks = (content, directoryLinks) => {
  if (!directoryLinks || directoryLinks.length === 0) return content;

  let result = content;

  for (const { label, url } of directoryLinks) {
    // Extract keyword: strip "Find " prefix and " near you" suffix, then strip trailing "s" for singular matching
    const keyword = label.replace(/^Find\s+/i, "").replace(/\s+near you$/i, "").replace(/s$/i, "");
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escaped})\\b`, "i");

    // Temporarily replace existing <a>...</a> blocks to avoid injecting inside them
    const anchors = [];
    const withPlaceholders = result.replace(/<a[\s\S]*?<\/a>/gi, (match) => {
      anchors.push(match);
      return `\x00ANCHOR${anchors.length - 1}\x00`;
    });

    // Replace only the first occurrence of the keyword
    let replaced = false;
    const injected = withPlaceholders.replace(regex, (word) => {
      if (replaced) return word;
      replaced = true;
      return `<a href="${url}" title="${label}">${word}</a>`;
    });

    // Restore the saved anchor blocks
    result = injected.replace(/\x00ANCHOR(\d+)\x00/g, (_, i) => anchors[parseInt(i, 10)]);
  }

  return result;
};

export default injectDirectoryLinks;
