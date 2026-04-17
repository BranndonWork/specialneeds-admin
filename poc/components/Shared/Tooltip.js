import Utils from "@utils";
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Tooltip = ({ content, anchorText, icon, offset, splitLinesAfter = 42, dotted = true }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const id = Utils.contentHash({ content, anchorText, icon });
  return (
    <>
      <ReactTooltip anchorId={id} offset={offset} />
      <a id={id} data-tooltip-html={splitLinesAfter ? Utils.splitLinesAfter(content, 42) : content}>
        {anchorText && <span className={dotted ? "dotted" : ""}>{anchorText}</span>}
        {icon && <i className={icon}></i>}
      </a>
    </>
  );
};


export default Tooltip;
