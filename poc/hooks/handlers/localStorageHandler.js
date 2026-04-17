import Utils from "@utils";

export function localStorageHandler(data) {
  if (!Array.isArray(data) || !data.length) {
    console.debug("Invalid data received for localStorage", data);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.action == "set") {
      console.debug("localStorage set", item.key, item.value, item.expires);
      Utils.localStorage.set(item.key, item.value, item.expires);
      if (item.key == "token") {
        window.location.reload();
      }
    } else if (item.action == "remove") {
      Utils.localStorage.remove(item.key);
    } else {
      console.debug("Invalid action received for localStorage", item);
    }
  }
}
