
import { initializeApp, FirebaseOptions } from 'firebase/app'; 
import { getMessaging, getToken, onMessage } from '@firebase/messaging';


const firebaseConfig: FirebaseOptions = {
      apiKey: "AIzaSyAXeVb3Ymg9OLQWl7b9-rgPHbEVTKsmc_s",
  authDomain: "my-pwa-learn.firebaseapp.com",
  projectId: "my-pwa-learn",
  storageBucket: "my-pwa-learn.firebasestorage.app",
  messagingSenderId: "553575623694",
  appId: "1:553575623694:web:a622b72bba0f370fb9a05f",
  measurementId: "G-PNHYRZ2KQE"
 }; 
const app = initializeApp(firebaseConfig); 
const messaging = getMessaging(app);
Notification.requestPermission().then(
    (permission: NotificationPermission) => {
        if(permission === 'granted') {
            console.log('Notification permission granted.');

            return getToken(messaging, {
                vapidKey: ''
            });
        } else {
            console.log('Unable to get permission to notify.');
        }
    }
).then((token: string | undefined) => {
    console.log('FCM TOKEN : ',  token);
// // send token to foundation
}).catch((err: Error) => {
    console.log('Error Occurred in retrieving FCM token : ', err);
});

onMessage(messaging, (payload: any) => {
    console.log('Message received. ', payload);
    // Customize notification here
  });
  
export { messaging, onMessage };