// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth"
import { getApps, initializeApp } from "firebase/app"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getFirestore, collection, getDocs,query,where, doc, getDoc, setDoc, deleteDoc,updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"

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
const storage = getStorage(app)
const auth = getAuth();


const tempUserProfileImage = 'https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/avatar-512.png'
const tempHouseProfileImage = 'https://cdn3.iconfinder.com/data/icons/luchesa-vol-9/128/Home-512.png'

const tempHouseDescripton = 'Let\'s be the best house ever !'


const capitalize = (text) => {
  if (text == '') return ''
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}

const capitalizeAll = (text) => {
  return text.split(' ').map(str => { return capitalize(str) }).join(' ')
}

function arrayRemove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

const getByDocIdFromFirestore = async(collect, docId) =>{

  const docRef = doc(db,collect,docId)
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
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

const getCollectionFromFirestoreByKeySubString = async(collect,substring) =>{
  if(substring == '')
    return [];
  const collectCol = collection(db, collect);
  const collectSnapshot = await getDocs(collectCol);
 
  const collectList = collectSnapshot.docs.filter(doc => { return String(doc.id).includes(substring) } ).map(doc => { return doc.data() });

  return collectList;
}

const getUCollectionFromFirestoreByUserNameSubString = async(collect,substring) =>{
  if(substring == '')
    return [];
  else{
    substring = capitalizeAll(substring)
    const collectCol = collection(db, collect);
    const collectSnapshot = await getDocs(collectCol);
  
    const collectList = collectSnapshot.docs.filter(doc => { return String(doc.data().fName + " " + doc.data().lName).includes(substring) } ).map(doc => { return doc.data() });
    
    return collectList;
  }
}

const getWhereFromFirestore = async(collect, col, term , value) => { // term can be - == ,<= ,>=, in (value is an array), array-contains-any (value is an array)... https://firebase.google.com/docs/firestore/query-data/queries// todo: fix return to return a llist
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

const addUserToFirestore = async(email, fName, lName, phone, bDate, uImage ) => {
  await setDoc(doc(collection(db, 'users'), email), {
      fName: capitalize(fName),
      lName: capitalize(lName),
      phone: phone,
      bDate: bDate,
      email: email.replace(' ',''),
      uImage: uImage ? uImage : tempUserProfileImage,
      incomes: {}
     });
    //  uploadImageToStorage('users',uImage ? uImage : tempUserProfileImage,email).then(alert()).catch()
}

const updateCollectAtFirestore = async(collect,key, col, newValue) => {
  const Data = doc(db, collect, key);
  await updateDoc(Data , col = col,newValue)
}

const updateDocAllColsAtFirestore = async(collect,key,newValuesDict) => {
  console.log(newValuesDict)
  const Data = doc(db, collect, key)
  await updateDoc(Data , newValuesDict)
}

const setDefaultHousePartners = (partners) => {
  let partnersDict = {}
  let defPermitions = {"seeIncome": false, "seeMonthlyBills": false}


  for(let i in partners){
    partnersDict[partners[i]["email"]] = {
      user : partners[i],
      isAuth: false,
      nowIn : false,
      defPermitions : defPermitions, 
      incomeToCurHouse: 0, // {[ company, amount ]}
      expends: {}, // {[ reasone, amount ]}
      allowance: {} // {[ from, amount ],...}
    }
    defPermitions = {"seeIncome": true, "seeMonthlyBills": true}
  }
  partnersDict[partners[0].email].isAuth = true
  partnersDict[partners[0].email].nowIn = true
  partnersDict[partners[0].email].defPermitions = defPermitions
  return partnersDict
}

const addHouseToFirestore = async(hName, cEmail, partners, hImage, description) => {
  let date = new Date()
  date = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes()
  partners = setDefaultHousePartners(partners)
  const house = {
    hName: hName,
    cEmail: cEmail,
    partners: partners,
    cDate: date,
    expends: {},
    hImage: hImage ? hImage : tempHouseProfileImage,
    description: description ? description : tempHouseDescripton,
    shoppingList:[{ itemName: 'item 1', quantity: 1, isSelected: false },
                  { itemName: 'item 2', quantity: 3, isSelected: true },
                  { itemName: 'item 3', quantity: 2, isSelected: false },],
    tasksList:[{ itemName: 'item 1', quantity: 1, isSelected: false },
                  { itemName: 'item 2', quantity: 3, isSelected: true },
                  { itemName: 'item 3', quantity: 2, isSelected: false },]
   }
  await setDoc(doc(collection(db, 'houses'), hName + "&" + cEmail),house );
  return house
}

const updateHousePartners = (partners, oldPartners) => {
  let partnersDict = {}
  let defPermitions = {"seeIncome": false, "seeMonthlyBills": false}

    for(let i in partners){

      for(let j in oldPartners)
        if(partners[i] == oldPartners[j])
          partnersDict[partners[i]["email"]] = oldPartners[i]

      if(!(partners[i]["email"] in Object.keys(partnersDict))){
        partnersDict[partners[i]["email"]] = {
          user : partners[i],
          isAuth: false,
          nowIn : false,
          defPermitions : defPermitions, 
          incomeToCurHouse: 0, // {[ company, amount ]}
          expends: {}, // {[ reasone, amount ]}
          allowance: {} // {[ from, amount ],...}
      }
      return partnersDict
    }
  }
}

const replaceUpdatedHouseToFirestore = async(house, newHName, partners, hImage, description) => {
  partners = updateHousePartners(partners,house.partners)
  house = {
    hName: newHName,
    cEmail: house.cEmail,
    partners: partners,
    cDate: house.cDate,
    expends: house.expends,
    hImage: hImage ? hImage : tempHouseProfileImage,
    description: description ? description : tempHouseDescripton,
    shoppingList: house.shoppingList
   }
  await setDoc(doc(collection(db, 'houses'), newHName + "&" + house.cEmail),house );
  return house
}

const updateHouseAtFirestore = async(hName, col, newValue) => {
  const data = { }
  data[col] = newValue
  await setDoc(doc(db,"houses", hName), {col: newValue } , {merge: true});
}

const getHouseKeyByNameAndCreatorEmail = (hName, cEmail) => {
  return hName + "&" + cEmail
}

const getHousesByUserEmail = async(cEmail) => {
   return getCollectionFromFirestore("houses").then((collection) => {
    if(collection)
      return collection.filter((house) => { if(cEmail in house.partners) return house  })
    else
      return []
  }).catch((e) => alert(e.massege))
}

const getHousePartnersByKey = async(hKey) => {
  return getByDocIdFromFirestore("houses", hKey).then((house) => {
   if(house){
     return house.partners
   }
   else
     return {}
 }).catch((e) => {})
}

const getHouseIncomeFromFirestore = async(hKey) => {
  return getHousePartnersByKey(hKey).then((partners) => {
    let hIncome = 0
   if(partners){
      for(const key in partners) { hIncome += parseInt(partners[key].incomeToCurHouse)}
    }
     return hIncome
 }).catch((e) => alert(e.massege))
}

const getHouseIncome = (house) => {
    let hIncome = 0
   if(house.partners){
      for(const key in house.partners) { hIncome += parseInt(partners[key].incomeToCurHouse)}
    }
     return hIncome
}

const getHouseExpendsAmount = (expends) => {
  let expendsAmount = 0
  for(const key in expends) expendsAmount+=parseInt(expends[key].amount)
  return expendsAmount
}

const getUserArrayFromPartnersDict = async(dict) => {
  let arr = []
  if(dict){
    // for(const key in dict) { arr.push(dict[key].user)}
    arr = Object.values(dict)
    for(const key in arr)
      arr[key] = arr[key].user
  }
    return arr
}

const getCurentPartnerOfHouse = async(hName,cEmail,curUEmail) => {
  const hKey = getHouseKeyByNameAndCreatorEmail(hName,cEmail)
  return getHousePartnersByKey(hKey).then((partners) => {
    let curPartner
   if(partners){
      for(const key in partners) { 
        if(partners[key].user["email"] == curUEmail) return partners[key] }
    }
     return {}
  }).catch((e) => alert(e.massege))
}

// const getExpendsOfUserAtHouse = async(hName,cEmail,curUEmail) => {
//   return getCurentPartnerOfHouse(hName,cEmail,curUEmail).then((partner) => {
//     return partner.expends
//   }).catch((e) => {console.log("getExpendsOfUserAtHouse - " + e.massege)})
// }


// const addExpendToHouse = async(hName, cEmail, curUEmail, expend) => {
//   getExpendsOfHouse(hName,cEmail,curUEmail).then((expends) => {
//     console.log(expends)
//     expends[expend.date] = expend
//     console.log(expends)
//     updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "expends", expends)
//   }).catch((e) => {console.log("getExpendsOfUserAtHouse - " + e.massege)})
// }

const addExpendToHouse = async(hName, cEmail,expends, expend) => 
{
  expends[expend.date] = expend
  updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "expends", expends)
}

const addUserSelfIncome = async(uEmail,incomes, income) => 
{
  incomes[income.date] = income
  updateCollectAtFirestore("users", uEmail, "incomes", incomes)
}

const removeUserSelfIncome = async(uEmail,incomes, income) => 
{
  delete incomes[income.date.toDate()]
  updateCollectAtFirestore("users",  uEmail, "incomes", incomes)
}

const removeExpendFromHouse = async(hName, cEmail,expends, expend) => 
{
  delete expends[expend.date.toDate()]
  updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "expends", expends)
}

const shoppingListToString = async(shoppingList) => 
{
  let str = ''
  for(const key in shoppingList) { str += (parseInt(key)+1) + ". " +shoppingList[key].itemName + " (" + shoppingList[key].quantity +")\n "}
  //str = str.substring(0,str.length-2)
  return str.toString()
}

const getSortedArrayDateFromDict = (dict) => {
  let array = Object.values(dict)
  return array.sort((a,b) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return b.date.toDate() - a.date.toDate()
  }); 
}

const getSrtDateAndTimeToViewFromSrtDate = (date) =>{
  let minutes = 10
  if(date.getMinutes() < minutes)
    minutes = "0" + date.getMinutes().toString()
  else minutes = date.getMinutes()
  return  date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + "  " + date.getHours() + ":" + minutes
}

const changePartnerIncomeOfHouse = async(hKey,uEmail,income) => {

  let partner = getHousePartnersByKey(hKey).then((partners) => {
   if(partners){
      console.log(partners)
      if(partners){
        for(const key in partners) { 
          if(partners[key].user["email"] == uEmail) {
            partners[key]["incomeToCurHouse"] = income
          } 
        }
      updateCollectAtFirestore("houses", hKey, "partners" ,partners)
      }
    }
     return {}
  }).catch((e) => alert(e.massege))
}

const addProductToFirestore = async(barcode, name, brand) => {
  await setDoc(doc(collection(db, 'products'), barcode), {
      barcode: barcode,
      name: name,
      brand: brand,
     });
}

export { auth, db, uiConfig ,tempHouseProfileImage, tempUserProfileImage,arrayRemove,capitalize ,capitalizeAll , getUserArrayFromPartnersDict,getByDocIdFromFirestore, getCollectionFromFirestore, getWhereFromFirestore, deleteRowFromFirestore, addUserToFirestore,updateCollectAtFirestore, updateDocAllColsAtFirestore,
        setDefaultHousePartners ,addHouseToFirestore, replaceUpdatedHouseToFirestore, updateHousePartners, updateHouseAtFirestore,getHousesByUserEmail, getHouseKeyByNameAndCreatorEmail, getCollectionFromFirestoreByKeySubString,getUCollectionFromFirestoreByUserNameSubString,
        getHousePartnersByKey, getHouseIncome, getCurentPartnerOfHouse, addExpendToHouse,addUserSelfIncome, removeUserSelfIncome, removeExpendFromHouse,shoppingListToString, getHouseExpendsAmount ,getSortedArrayDateFromDict, getSrtDateAndTimeToViewFromSrtDate, changePartnerIncomeOfHouse,
        addProductToFirestore} 

