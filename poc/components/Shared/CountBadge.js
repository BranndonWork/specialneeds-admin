const CountBadge = ({ count, ariaLabel }) => {
  let formattedCount = count;

  if (formattedCount > 999) {
    formattedCount = Math.floor(formattedCount / 100);
    formattedCount = `${formattedCount / 10}k`;
    formattedCount = formattedCount.replace(".0", "");
  } else if (typeof formattedCount === "number") {
    formattedCount = formattedCount.toLocaleString();
  }

  return (
    <span
      className="custom-badge"
      aria-label={ariaLabel || `${count} items`}
      role="status"
      title={count}
    >
      {formattedCount}
    </span>
  );
};

export default CountBadge;
