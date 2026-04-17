import React from "react";

const SidebarContactInformation = ({ contactDetails }) => {
  // if the contact details are not passed, don't show the contact details
  if (typeof contactDetails !== "object" || contactDetails?.content?.length === 0) return null;

  if (contactDetails?.content?.length === 0) return null;

  return (
    <div className="listings_contact_details">
      <h3>{contactDetails.title}</h3>
      <ul>
        {contactDetails.content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
export default SidebarContactInformation;
