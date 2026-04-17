const ReadingTime = ({ content }) => {
  if (!content) return null;

  const text = content.replace(/<[^>]+>/g, " ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 180);

  if (minutes < 1) return null;

  return (
    <span className="reading-time">
      <i className="bx bx-time-five"></i> {minutes} min read
    </span>
  );
};

export default ReadingTime;
