import Utils from "@utils";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const useTooltip = (openDelay) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initiatedByClick, setInitiatedByClick] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const handleMouseEnter = () => {
    if (isOpen) return;

    timer.current = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
    if (initiatedByClick) setInitiatedByClick(false);
  };

  const handleMouseLeave = () => {
    if (initiatedByClick && isOpen) {
      return;
    }
    clearTimeout(timer.current);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (initiatedByClick) {
        setIsOpen(false);
        setInitiatedByClick(false);
      }
    };
    if (initiatedByClick) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [initiatedByClick, isOpen]);

  const handleClick = (e) => {
    e.stopPropagation();

    if (isOpen && initiatedByClick) {
      setIsOpen(false);
      setInitiatedByClick(false);
      return;
    }

    setInitiatedByClick(true);
    setIsOpen(true);
  };
  return { isOpen, handleMouseEnter, handleMouseLeave, handleClick };
};

const ClickableTooltip = ({
  content,
  anchorText = "",
  icon = "bx bx-info-circle",
  wrapperStyle = { paddingLeft: "5px" },
  iconPosition = "right",
}) => {
  const { isOpen, handleMouseEnter, handleMouseLeave, handleClick } = useTooltip(750);
  const id = Utils.contentHash({ content, anchorText, icon, wrapperStyle });

  if (!anchorText && !icon) return null;

  return (
    <>
      <span
        style={{ ...wrapperStyle, cursor: "pointer" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={anchorText}
      >
        <Tooltip id={id} isOpen={isOpen} title={anchorText} />
        <a
          data-tooltip-id={id}
          data-tooltip-html={Utils.splitLinesAfter(content, 42)}
          title={anchorText}
          aria-label={anchorText}
        >
          <span className="dotted">
            {icon && iconPosition === "left" && (
              <i
                className={icon}
                style={anchorText ? { paddingRight: "5px" } : {}}
                title={anchorText}
                aria-label={anchorText}
              ></i>
            )}
            <span aria-hidden="false">{anchorText}</span>
            {icon && iconPosition === "right" && (
              <i
                className={icon}
                style={anchorText ? { paddingLeft: "5px" } : {}}
                title={anchorText}
                aria-label={anchorText}
              ></i>
            )}
          </span>
        </a>
      </span>
    </>
  );
};

export default ClickableTooltip;
