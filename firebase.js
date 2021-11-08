// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { getApps, initializeApp } from "firebase/app";
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

// Initialize Firebase
let app;
if(!getApps.length){
    app = initializeApp(firebaseConfig);
} else {
    app = app()
}
const auth = getAuth();
export { auth } 
