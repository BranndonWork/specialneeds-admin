import Utils from "@utils";

export const DisplayPhone = ({ phone }) => {
  return (
    <a href={`tel:${phone}`}>
      <i className="bx bx-phone-call"></i> {Utils.formattedPhone(phone)}
    </a>
  );
};

export default Phone;
