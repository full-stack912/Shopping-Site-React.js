importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "427826178089"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {

      return registration.showNotification("Zendasgh Notification", {body:payload.data.message});
    });
  return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
  // do what you want
  // ...
});
