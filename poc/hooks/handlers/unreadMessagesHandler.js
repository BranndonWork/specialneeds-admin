import Utils from "@utils";

export function unreadMessagesHandler(data) {
  let messages = data;
  if (messages.length > 0) {
    Utils.localStorage.set("unreadMessages", messages);
  } else {
    Utils.localStorage.remove("unreadMessages");
  }
}
