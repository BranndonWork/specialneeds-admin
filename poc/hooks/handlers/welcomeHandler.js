export function welcomeHandler(data) {
  window.sessionStorage.setItem("channel_name", data.channel_name);
}
