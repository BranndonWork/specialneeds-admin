import Link from "next/link";
import Utils from "../index";

function getContactWidgetContent(content, extraContacts = []) {
  const contactDetails = {
    title: "Contact Details",
    content: [],
  };

  let contact = content;
  if (!contact) return null;

  if (extraContacts.length > 0) {
    extraContacts.forEach((extraContact) => {
      if (extraContact.value) {
        contactDetails.content.push(
          <>
            <i className="bx bx-user"></i>
            <strong>{extraContact.label}:</strong>
            <br />
            {extraContact.value}
          </>
        );
      }
    });
  }
  if (contact.website) {
    contactDetails.content.push(
      <>
        <i className="bx bx-globe"></i>
        <Link href={contact.website}>
          <a target="_blank">{contact.website}</a>
        </Link>
      </>
    );
  }
  if (contact.email) {
    contactDetails.content.push(
      <>
        <i className="bx bx-envelope"></i>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </>
    );
  }
  if (contact.phone) {
    contactDetails.content.push(
      <>
        <i className="bx bx-phone-call"></i>
        <Link href={`tel:${contact.phone}`}>
          <a>{Utils.displayPhoneNumber(content)}</a>
        </Link>
      </>
    );
  }
  if (content.address.state_province && content.address.city) {
    contactDetails.content.push(
      <>
        <i className="bx bx-map"></i>
        <Link
          href={"https://www.google.com/maps/search/?api=1&query=" + Utils.displayAddress(content)}
        >
          <a target="_blank">
            <div
              dangerouslySetInnerHTML={{
                __html: Utils.displayAddress(content, false),
              }}
            ></div>
          </a>
        </Link>
      </>
    );
  }
  if (contactDetails.content.length > 0) {
    return contactDetails;
  }
  return null;
}

export default getContactWidgetContent;
