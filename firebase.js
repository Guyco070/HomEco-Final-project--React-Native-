// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection, getDocs,query,where, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

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
const db = getFirestore(app)
const auth = getAuth();

const getByDocIdFromFirestore = async(collect, docId) =>{
  const docRef = doc(db,collect,docId)
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  return docSnap.data()
}

const getCollectionFromFirestore = async(collect) =>{
  const collectCol = collection(db, collect);
  const collectSnapshot = await getDocs(collectCol);
  const collectList = collectSnapshot.docs.map(doc => doc.data());

  return collectList;
}

const getWhereFromFirestore = async(collect, col,term , value) => { // term canbe - == ,<= ,>=, in (value is an array), array-contains-any (value is an array)... https://firebase.google.com/docs/firestore/query-data/queries// todo: fix return to return a llist
  const q = query(collection(db, collect), where(col, term, value))
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log("doc.id, doc.data()");

    console.log(doc.id, " => ", doc.data());
  });
  const collectList = querySnapshot.docs.map(doc => doc.data());
  return collectList
}

const deleteRowFromFirestore = async(collect, docId) => {
  await deleteDoc(doc(db,collect, docId))
}

const addUserToFirestore = async(email, fName, lName, phone, bDate ) => {
  await setDoc(doc(collection(db, 'users'), email), {
      fName: fName,
      lName: lName,
      phone: phone,
      bDate: bDate,
      email: email
     });
}

const updateUserAtFirestore = async(userEmail, col, newValue) => {
  const data = { }
  data[col] = newValue
  console.log(data)
  await setDoc(doc(db,"users", userEmail), {col: newValue } , {merge: true});
}

export { auth, uiConfig ,getByDocIdFromFirestore, getCollectionFromFirestore, getWhereFromFirestore, deleteRowFromFirestore, addUserToFirestore, updateUserAtFirestore} 
