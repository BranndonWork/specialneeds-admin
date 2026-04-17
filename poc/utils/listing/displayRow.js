import Tooltip from "../../components/Shared/Tooltip";
import Utils from "../index";

export const displayRow = (value, label, tooltip) => {
  const colWidth = "col-4";
  const originalLabel = label;
  if (tooltip) {
    label = <Tooltip content={tooltip} anchorText={label} />;
  }

  if (typeof value === "boolean") {
    return (
      <tr>
        <td className={colWidth}>
          <strong>{label}:</strong>
        </td>
        <td>{value ? "Yes" : "No"}</td>
      </tr>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <tr>
        <td className={colWidth}>
          <strong>{label}:</strong>
        </td>
        <td>{value.join(", ")}</td>
      </tr>
    );
  }

  if (Utils.isValidUrl(value)) {
    let url = `<a href="${value}" target="_blank">${value}</a>`;
    return (
      <tr>
        <td className={colWidth}>
          <strong>{label}:</strong>
        </td>
        <td>
          <div dangerouslySetInnerHTML={{ __html: url }} />
        </td>
      </tr>
    );
  }

  if (value) {
    // if label starts with "Percent", add a % sign to the end of the value
    if (originalLabel.match(/^Percent/)) {
      value = String(value) + "%";
    }
    return (
      <tr>
        <td className={colWidth}>
          <strong>{label}:</strong>
        </td>
        <td>{value}</td>
      </tr>
    );
  }

  return null;
};

export default displayRow;
