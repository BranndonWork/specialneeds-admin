import Utils from "@utils";

export function setCookiesHandler(data) {
  if (!Array.isArray(data) || !data.length) {
    console.debug("Invalid data received for set_cookies", data);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.action == "set") {
      const options = {};
      if (item.expires) options.expires = item.expires;
      Utils.cookies.set(item.key, item.value, options);
    } else if (item.action == "remove") {
      Utils.cookies.remove(item.key);
    } else {
      console.debug("Invalid action received for set_cookies", item);
    }
  }
}
