// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHNz6VjJd7RhCWqz-QJWYgqWwtPlCQt6s",
  authDomain: "homeco-8262b.firebaseapp.com",
  projectId: "homeco-8262b",
  storageBucket: "homeco-8262b.appspot.com",
  messagingSenderId: "61370725143",
  appId: "1:61370725143:web:35df7ae9c1ef2b3872fd52"
};

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/Home',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

// Initialize Firebase
let app;
if(!getApps.length){
    app = initializeApp(firebaseConfig);
} else {
    app = app()
}
const auth = getAuth();

export { auth, uiConfig } 
