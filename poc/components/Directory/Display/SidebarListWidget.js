import React from "react";

const SidebarListWidget = ({ title, list }) => {
  // if the contact details are not passed, don't show the contact details
  if (!list || typeof list !== "object" || Object.keys(list).length === 0) return null;
  if (Object.keys(list).length === 0) return null;
  return (
    <aside className="listings-widget">
      <div className="listings_generic_details">
        <h3>{title}</h3>
        <ul>
          {list.map((item, index) => (
            <li key={index}>
              <i className="bx bx-chevron-right"></i>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};


export default SidebarListWidget;
