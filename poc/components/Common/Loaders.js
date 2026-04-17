// https://cssloaders.github.io/

export const CssSpinner = ({
  height = 32,
  width = 32,
  color = "#b52000",
  thickness = 5,
  wrapperStyle = {},
}) => {
  if (typeof height === "string") height = parseInt(height) || 32;
  if (typeof width === "string") width = parseInt(width) || 32;
  if (typeof thickness === "string") thickness = parseInt(thickness) || 5;

  height = height - thickness * 2;
  width = width - thickness * 2;

  return (
    <span className="css-spinner-wrapper" style={wrapperStyle}>
      <span className="css-spinner"></span>
      <style jsx>{`
        .css-spinner-wrapper {
          display: inline-block;
          position: relative;
          width: ${width}px;
          height: ${height}px;
        }
        .css-spinner {
          display: inline-block;
          width: ${width}px;
          height: ${height}px;
          border: ${thickness}px solid #fff;
          border-bottom-color: ${color};
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </span>
  );
};
