import React from "react";

const SidebarDictWidget = ({ title, dict }) => {
  // if the contact details are not passed, don't show the contact details
  if (typeof dict !== "object" || Object.keys(dict).length === 0) return null;
  if (Object.keys(dict).length === 0) return null;

  return (
    <aside className="listings-widget">
      <div className="listings_generic_details">
        <h3>{title}</h3>
        <ul>
          {dict.map((item, index) => (
            <li key={index}>
              <i className={item.icon || "bx bx-chevron-right"}></i>
              {item.label && (
                <div>
                  <strong>{item.label}:</strong>
                </div>
              )}
              {item.content}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};


export default SidebarDictWidget;
