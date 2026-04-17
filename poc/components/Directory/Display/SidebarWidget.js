import React from "react";

const SidebarWidget = ({ widgetDetails }) => {
  // if the contact details are not passed, don't show the contact details
  if (typeof widgetDetails !== "object" || Object.keys(widgetDetails).length === 0) return null;

  if (Object.keys(widgetDetails.content).length === 0) return null;

  return (
    <aside className="listings-widget">
      <div className="listings_generic_details">
        <h3>{widgetDetails.title}</h3>
        <ul>
          {widgetDetails.content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
export default SidebarWidget;
