import Utils from "@utils";

export const ListInformation = ({ list, title, splitAt }) => {
  if (!list || list.length === 0) return null;
  let groups = [];
  if (splitAt && list.length > splitAt) {
    // split the list into groups of splitAt items
    for (let i = 0; i < list.length; i += splitAt) {
      groups.push(list.slice(i, i + splitAt));
    }
  } else {
    groups.push(list);
  }

  return (
    <div className="listings-widget listings_generic_details mb-3">
      <div className="listings-widget-content">
        {title && title.length > 0 && (
          <strong className="listings-widget-title">{Utils.toTitleCase(title)}: </strong>
        )}
        {groups.join(", ")}
      </div>
      <div className="clearfix"></div>
    </div>
  );
};

export default ListInformation;
