
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAXeVb3Ymg9OLQWl7b9-rgPHbEVTKsmc_s",
authDomain: "my-pwa-learn.firebaseapp.com",
projectId: "my-pwa-learn",
storageBucket: "my-pwa-learn.firebasestorage.app",
messagingSenderId: "553575623694",
appId: "1:553575623694:web:a622b72bba0f370fb9a05f",
measurementId: "G-PNHYRZ2KQE"
}; 



firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const notificationTitle = payload.notification?.title || 'Default Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Default Body',
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
  });