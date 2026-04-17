// ContentLoadingPlaceholder component
const ContentLoadingPlaceholder = ({ styleOverrides = {} }) => {
  return (
    <div
      style={{
        display: "block",
        backgroundColor: "#f2f4f5",
        width: "100%",
        ...styleOverrides,
      }}
    ></div>
  );
};
export default ContentLoadingPlaceholder;
