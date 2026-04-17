const ClearFilters = ({ onClick }) => {
  return (
    <svg
      onClick={onClick}
      style={{ cursor: "pointer", marginLeft: "5px" }}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#e53935" />
      <path
        d="M15 9L9 15M9 9L15 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ClearFilters;
