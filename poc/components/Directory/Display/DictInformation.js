import Utils from "@utils";

export const DictInformation = ({ title, dict }) => {
  if (!dict || Object.keys(dict).length === 0) return null;
  if (dict && Object.keys(dict).length > 0) {
    return (
      <div className="listings-widget listings_generic_details">
        {title && title.length > 0 && (
          <h3 className="listings-widget-title">{Utils.toTitleCase(title)}</h3>
        )}
        <div className="listings-widget-content">
          <ul className="listings-widget-list">
            {Object.keys(dict).map((key, index) => {
              let item = dict[key];
              // key = Utils.contentHash(item)
              return (
                <li className="listings-widget-list-item" key={index}>
                  <strong className="listings-widget-list-item-label">{item.label}</strong>
                  <div
                    className="listings-widget-list-item-value"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default DictInformation;
