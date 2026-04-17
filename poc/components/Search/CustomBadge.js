const CustomBadge = ({ content, onClick, title, styleOverrides = {} }) => {
  return (
    <div
      className="custom-badge"
      onClick={onClick}
      style={styleOverrides}
      {...(title ? { title } : {})}
    >
      {content}
    </div>
  );
};

export default CustomBadge;
