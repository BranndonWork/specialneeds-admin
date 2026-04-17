// app/utils/listing/showNoTableDataMessage.js

// for any table in wrapperClass, if there are no rows,
// replace the table with a message that there is no data to display
function showNoTableDataMessage(wrapperClass) {
  if (!wrapperClass) {
    wrapperClass = "";
  }

  const tables = document.querySelectorAll(wrapperClass);
  tables.forEach((table) => {
    if (table.querySelectorAll("tr").length === 0) {
      const message = document.createElement("div");
      message.classList.add("no-data-message");
      message.classList.add("mb-4");
      // add a style to the message
      message.style.marginTop = "-5px";
      message.style.fontWeight = "600";
      message.style.fontStyle = "italic";
      message.innerHTML = "No data to display";
      table.parentNode.replaceChild(message, table);
    }
  });
}

export default showNoTableDataMessage;
