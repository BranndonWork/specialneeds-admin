export function sessionStorageHandler(data) {
  if (!Array.isArray(data) || !data.length) {
    console.debug("Invalid data received for sessionStorage", data);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.action == "set") {
      window.sessionStorage.setItem(item.key, item.value);
    } else if (item.action == "remove") {
      window.sessionStorage.removeItem(item.key);
    } else {
      console.debug("Invalid action received for sessionStorage", item);
    }
  }
}
