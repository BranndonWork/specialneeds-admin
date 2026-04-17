import Utils from "@utils";

export const StringInformation = ({ string, title }) => {
  if (string && typeof string === "string") {
    return (
      <div className="listings-widget listings_generic_details">
        {title && <h3 className="listings-widget-title">{Utils.toTitleCase(title)}</h3>}
        <div className="listings-widget-content">
          <div
            className="listings-widget-list-item-value"
            dangerouslySetInnerHTML={{ __html: string }}
          ></div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
export default StringInformation;
