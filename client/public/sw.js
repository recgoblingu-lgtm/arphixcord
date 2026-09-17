self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: "ArphixCord", body: event.data?.text() || "New notification" }; }
  event.waitUntil(self.registration.showNotification(data.title || "ArphixCord", { body: data.body || "New notification", icon: data.icon || "/favicon.ico", data: { link: data.link || "/" } }));
});
self.addEventListener("notificationclick", event => { event.notification.close(); event.waitUntil(clients.openWindow(event.notification.data?.link || "/")); });
