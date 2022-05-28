// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth"
import { getApps, initializeApp } from "firebase/app"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getFirestore, collection, getDocs,query,where, doc, getDoc, setDoc, deleteDoc,updateDoc, addDoc, orderBy, Timestamp, onSnapshot, Firestore} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { firebaseConfig } from "./PrivateVariables"
// import { LogBox } from "react-native"

// LogBox.ignoreAllLogs(true)

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
    // console.log("No such document!");
    return false
  }

  return docSnap.data()
}

const getCollectionFromFirestore = async(collect) =>{
  const collectCol = collection(db, collect);
  const collectSnapshot = await getDocs(collectCol);
  const collectList = collectSnapshot.docs.map(doc => doc.data());

  return collectList;
}

const getDocFromFirestoreByKeySubString = async(collect,substring) =>{
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
  const querySnapshot = getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log("doc.id, doc.data()");

  //   console.log(doc.id, " => ", doc.data());
  // });;
  return querySnapshot.docs.map(doc => doc.data())
}

const deleteRowFromFirestore = async(collect, docId) => {
  return await deleteDoc(doc(db,collect, docId)).then(() => true)
}

const addUserToFirestore = async(email, fName, lName, phone, bDate, uImage ) => {
  await setDoc(doc(collection(db, 'users'), email), {
      fName: capitalize(fName),
      lName: capitalize(lName),
      phone: phone,
      bDate: bDate,
      email: email.replace(' ',''),
      uImage: uImage ? uImage : tempUserProfileImage,
      incomes: {},
      tipsCounter: 0,
      isGetTips: true
     });
    //  uploadImageToStorage('users',uImage ? uImage : tempUserProfileImage,email).then(alert()).catch()
}

const addDocToFirestore = async(collect, newValue) => {
  return await setDoc(doc(collection(db, collect)), newValue).then( () => true);
}

const addDocByIdToFirestore = async(collect, key, values) => {
  return await setDoc(doc(collection(db, collect), key),values).then( () => true);
}

const updateCollectAtFirestore = async(collect,key, col, newValue) => {
  const Data = doc(db, collect, key);
  return await updateDoc(Data , col = col,newValue).then(() => true)
}

const updateDocAllColsAtFirestore = async(collect,key,newValuesDict) => {
  const Data = doc(db, collect, key)
  return await updateDoc(Data , newValuesDict).then(() => true)
}

const setDefaultHousePartners = (partners) => {
  let partnersDict = {}
  let permissions = {"seeIncome": false, "seeMonthlyBills": false, "changeGallery": false}


  for(let i in partners){
    partnersDict[partners[i]["email"]] = {
      user : partners[i],
      isAuth: false,
      nowIn : false,
      permissions : permissions, 
      incomeToCurHouse: 0, // {[ company, amount ]}
      expends: {}, // {[ reasone, amount ]}
      allowance: {} // {[ from, amount ],...}
    }
    permissions = {"seeIncome": true, "seeMonthlyBills": true, "changeGallery": false}
  }
  partnersDict[partners[0].email].isAuth = true
  partnersDict[partners[0].email].nowIn = true
  partnersDict[partners[0].email].permissions = permissions
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
    incomes: {},
    futureIncomes: {},
    futureExpendes: {},
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
  await setDoc(doc(collection(db, 'chats'), hName + "&" + cEmail),{ messges: [] });
  return house
}

const updateHousePartners = (partners, oldPartners, oldHFullPartners) => {
  let partnersDict = {}
  let permissions = {"seeIncome": false, "seeMonthlyBills": false, "changeGallery": false}
    for(let i in partners){

      for(let j in oldPartners)
        if(partners[i] == oldPartners[j])
          partnersDict[partners[i]["email"]] = oldHFullPartners[oldPartners[j].email]
        
      if(!(partners[i]["email"] in partnersDict)){
        if(!(partners[i]["email"] in oldHFullPartners)){
            partnersDict[partners[i]["email"]] = {
              user : partners[i],
              isAuth: false,
              nowIn : false,
              permissions : permissions, 
              incomeToCurHouse: 0, // {[ company, amount ]}
              expends: {}, // {[ reasone, amount ]}
              allowance: {} // {[ from, amount ],...}
          }
        }else{
          const curPartner = [partners[i]["email"]]
            partnersDict[curPartner] = {
              user : oldHFullPartners[curPartner].user,
              isAuth: oldHFullPartners[curPartner].isAuth,
              nowIn : oldHFullPartners[curPartner].nowIn,
              permissions : oldHFullPartners[curPartner].permissions, 
              incomeToCurHouse: oldHFullPartners[curPartner].incomeToCurHouse, // {[ company, amount ]}
              expends: oldHFullPartners[curPartner].expends, // {[ reasone, amount ]}
              allowance: oldHFullPartners[curPartner].allowance // {[ from, amount ],...}
          }
        }
      }
  }
    return partnersDict
}

const replaceUpdatedHouseToFirestore = async(house, newHName, partners, hImage, description, oldHFullPartners) => {
  getByDocIdFromFirestore('chats',house.hName + "&" + house.cEmail).then( messages => addDocByIdToFirestore('chats',newHName + "&" + house.cEmail, messages))
  partners = updateHousePartners(partners,house.partners, oldHFullPartners)
  house['hName'] = newHName
  house['hImage'] = hImage ? hImage : tempHouseProfileImage
  house['description'] = description ? description : tempHouseDescripton
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

const getHouseIncome = (incomes) => {
  let incomesAmount = 0
  for(const key in incomes) incomesAmount+=parseInt(incomes[key].amount)
  return incomesAmount
  //   let hIncome = 0
  //  if(house.partners){
  //     for(const key in house.partners) { hIncome += parseInt(house.partners[key].incomeToCurHouse); }
  //   }
  //    return hIncome
}

const getHouseExpendsAmount = (expends) => {
  let expendsAmount = 0
  for(const key in expends) expendsAmount += parseInt(expends[key].amount)
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

const addExpendToHouse = async(hName, cEmail,expends, futureExpendes, expend) => 
{
  if(expend.date <= new Date()){
    expends[expend.date] = expend
    updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "expends", expends)

    if(expend.billingType !== "One-time")
      addFutureExpenditureOrIncome(hName, cEmail, "futureExpendes", expend, futureExpendes)
  }else {
    futureExpendes[expend.date] = expend
    updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "futureExpendes", futureExpendes)
  }

  // Auto Classification
  if(expend?.descOpitional != '' && expend.desc != "Supermarket"){
    getByDocIdFromFirestore('expenditureTypesByOptionalDescription', expend.descOpitional).then(async(typeByOptionalDescription) => {
      if(typeByOptionalDescription)
        if(expend.desc in typeByOptionalDescription)
          updateCollectAtFirestore("expenditureTypesByOptionalDescription",expend.descOpitional , expend.desc, parseInt(typeByOptionalDescription[expend.desc]) + 1)
        else updateCollectAtFirestore("expenditureTypesByOptionalDescription",expend.descOpitional , expend.desc, 1)
      else{
            const newDescription = {}
            newDescription[expend.desc] = 1
            await setDoc(doc(collection(db, 'expenditureTypesByOptionalDescription'), expend.descOpitional), newDescription); 
          }
    })
  }

  getByDocIdFromFirestore('expenditureTypesByCompany', expend.company).then(async(typeByCompany) => {
    if(typeByCompany)
      if(expend.desc in typeByCompany)
        updateCollectAtFirestore("expenditureTypesByCompany",expend.company , expend.desc, parseInt(typeByCompany[expend.desc]) + 1)
      else updateCollectAtFirestore("expenditureTypesByCompany",expend.company , expend.desc, 1)
    else{
          const newCompany = {}
          newCompany[expend.desc] = 1
          await setDoc(doc(collection(db, 'expenditureTypesByCompany'), expend.company), newCompany); 
        }
  })
}

   
const addIncomeToHouse = async(hName, cEmail, incomes, futureIncomes, income) => 
{
  if(income.date <= new Date()){
    incomes[income.date] = income
    updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "incomes", incomes)
    if(income.billingType !== "One-time")
      addFutureExpenditureOrIncome(hName, cEmail, "futureIncomes", income, futureIncomes)
  }else{
    futureIncomes[income.date] = income
    updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "futureIncomes", futureIncomes)
  }
}

const futureDateActions = {
  "Weekly": (curCreate) => {curCreate.date.setDate(curCreate.date.getDate() + 7)}, 
  "Fortnightly": (curCreate) => {curCreate.date.setDate(curCreate.date.getDate() + 14)},
  "Monthly": (curCreate) => {curCreate.date.setMonth(curCreate.date.getMonth() + 1)},
  "Bi-monthly": (curCreate) => {curCreate.date.setMonth(curCreate.date.getMonth() + 2)},
  "Annual": (curCreate) => {curCreate.date.setYear(curCreate.date.getFullYear() + 1)},
  "Biennial": (curCreate) => {curCreate.date.setYear(curCreate.date.getFullYear() + 2)}
}

const countNext = (curCreate) => { 
  let i = 0;
  const now = new Date()
  const curDate = new Date(curCreate.date)
  
  for(i;;i++){ 
    if("date" in curCreate && new Date(curCreate.date) <= now){
      futureDateActions[curCreate.billingType](curCreate)
    }else{ break}
  } 

  curCreate.date.setDate(curDate.getDate())
  curCreate.date.setMonth(curDate.getMonth())
  curCreate.date.setYear(curDate.getFullYear())
  return i
}

const getFutureExpenditure = (curCreate) => {
  if( curCreate.payments === "" || (curCreate.payments !== "" && parseInt(curCreate.payments) !== parseInt(curCreate.totalPayments)) ){
    if("seconds" in curCreate.date)
      curCreate["date"] = curCreate.date.toDate()

    if(curCreate.payments !== "")
      curCreate["payments"] = parseInt(curCreate.payments) + 1

    futureDateActions[curCreate.billingType](curCreate)

    curCreate["date"] = curCreate.date
    curCreate["isFuture"] = true

    return curCreate
  }else return null
}

const getAllNextExpendituresOrIncomes = (curCreate) => {
  const neois = []
  if("seconds" in curCreate.date)
  curCreate["date"] = curCreate.date.toDate()
  let i = countNext({...curCreate})

  for(i; i>=0 ;i--){
    neois.push(JSON.parse(JSON.stringify(curCreate)))
    getFutureExpenditure(curCreate)
  }
  // console.log("-neois",neois,"neois-")

  return neois
}

const addFutureExpenditureOrIncome = (hName, cEmail, type, curCreate, futures) => { // type = "futureExpendes" or "futureIncome", curCreate = expenditure or income object
    const nextExpenditure = getFutureExpenditure(curCreate)

    if(nextExpenditure  != null){ 
      futures[nextExpenditure.date] = nextExpenditure
      updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), type, futures)
  }
}

const updateExpendOrIncome = (house, futureType, type) => { // futureType = "futureExpendes" || "futureIncomes", type = "expends" || "incomes"
  const now = new Date()

  Object.values(house[futureType]).filter((fExp) => { return fExp.date.toDate() <= now }).map((fExp) => {
    const x = getAllNextExpendituresOrIncomes(fExp)
    x.map((fExp,i) =>{
          fExp["date"] = Timestamp.fromDate(new Date (fExp.date))

          if(fExp.date.toDate() <= now)  house[type][fExp.date.toDate()] = {...fExp}
          else   house[futureType][fExp.date.toDate()] = {...fExp}; 

          if(i === 0)   delete house[futureType][fExp.date.toDate()]
        })
    })
}

const updateExpendsAndIncomes = async(hKey) => {
   return await getByDocIdFromFirestore("houses",hKey).then((house) => {
    updateExpendOrIncome(house, "futureExpendes", "expends")
    updateExpendOrIncome(house, "futureIncomes", "incomes")

    const Data = doc(db, "houses", hKey);
    updateDoc(Data ,{futureExpendes: house.futureExpendes, expends: house.expends})

    return house
  })
}

const getExpenditureTypeAutoByOptionalDescription = async(descOpitional) => {
  return getByDocIdFromFirestore('expenditureTypesByOptionalDescription', descOpitional).then(async(typeByOptionalDescription) => {
    if(typeByOptionalDescription){
        // Create items array
        let items = Object.keys(typeByOptionalDescription).map((key) => {
          return [key, typeByOptionalDescription[key]];
        });
      
        // Sort the array based on the second element
        items.sort((first, second) => {
          return second[1] - first[1];
        });
        return items[0][0]
      }
    return ''
  })
}

const getExpenditureTypeAutoByCompany = async(company) => {
  return getByDocIdFromFirestore('expenditureTypesByCompany', company).then(async(typeByCompany) => {
        if(typeByCompany){
          // Create items array
          let items = Object.keys(typeByCompany).map((key) => {
            return [key, typeByCompany[key]];
          });

          // Sort the array based on the second element
          items.sort((first, second) => {
            return second[1] - first[1];
          });
          return items[0][0]
        }
        else return ''
    })
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

const removeExpendFromHouse = async(hName, cEmail,expends, expend, futureExpendes, isRemovingFeautures) => 
{
  delete expends[expend.date.toDate()]
  updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "expends", expends)

  if(isRemovingFeautures){
    const nextExpenditure = getFutureExpenditure(expend)
    if(nextExpenditure  != null){
      delete futureExpendes[nextExpenditure.date]
      updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "futureExpendes", futureExpendes)
    }
  }
}

const removeIncomeFromHouse = async(hName, cEmail,incomes, income, futureIncomes, isRemovingFeautures) => 
{
  delete incomes[income.date.toDate()]
  updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "incomes", incomes)
  if(isRemovingFeautures){
    const nextIncome = getFutureExpenditure(income)
    if(nextIncome  != null){
      delete futureIncomes[nextIncome.date]
      updateCollectAtFirestore("houses", getHouseKeyByNameAndCreatorEmail(hName, cEmail), "futureIncomes", futureIncomes)
    }
  }
}

const shoppingListToString = async(shoppingList) => 
{
  let str = '\n'
  for(const key in shoppingList) { str += (parseInt(key)+1) + ". " +shoppingList[key].itemName + " (" + shoppingList[key].quantity +")\n "}
  //str = str.substring(0,str.length-2)
  return str.toString()
}

const getSortedArrayDateFromDict = (dict) => {
  let array = Object.values(dict)
  if(array.length == 1) return [array[0]]
  return array.sort((a,b) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return b.date.toDate() - a.date.toDate()
  }); 
}

const getStrDateAndTimeToViewFromSrtDate = (date) =>{
  let minutes = 10
  if(date.getMinutes() < minutes)
    minutes = "0" + date.getMinutes().toString()
  else minutes = date.getMinutes()
  return  date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + "  " + date.getHours() + ":" + minutes
}

const getStrDateToViewFromSrtDate = (date) =>{
  return  date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear()
}

const changePartnerIncomeOfHouse = async(hKey,uEmail,income) => {
  let partner = getHousePartnersByKey(hKey).then((partners) => {
      if(partners){
        for(const key in partners) { 
          if(partners[key].user["email"] == uEmail) {
            partners[key]["incomeToCurHouse"] = income
          } 
        }
        updateCollectAtFirestore("houses", hKey, "partners" ,partners)
      }
      return {}
  }).catch((e) => alert(e.massege))
}

const getUserIncomeToHouse = (house,uEmail) => {
      if(house.partners){
        for(const key in house.partners) { 
          if(house.partners[key].user["email"] == uEmail)
            return house.partners[key]["incomeToCurHouse"]
        }    
      }
    }

const getUserIncomeOrExpendsToHouseByMonth = (incomes,uEmail) => {
    const arr = getSortedArrayDateFromDict(incomes)
    const curMonth = (new Date()).getMonth()
    let incomesAmount = 0
    let incomesQuntity = 0
    arr.map((income) => { if(income.date.toDate().getMonth() === curMonth && income.partner == uEmail){ (incomesAmount += parseInt(income.amount)); incomesQuntity++; }; }); 
    return {incomesAmount, incomesQuntity}
  }

const addProductToFirestore = async(barcode, name, brand) => {
  await setDoc(doc(collection(db, 'products'), barcode), {
      barcode: barcode,
      name: name,
      brand: brand,
     });
}

const getChatFromFirestore = async(chatInvolves) =>{ // chatInvolves: Array
  const collectCol = collection(db, "chats")
  const collectSnapshot = await getDocs(query(collectCol, orderBy("createdAt","desc"),))
  
  // console.log(collectSnapshot.docs.map((doc) => console.log("involves" in doc.data() ? chatInvolves.every((x) => {return doc.data().involves.includes(x)}) : false)));
  
  const collectList = collectSnapshot.docs.filter((doc) => {return "involves" in doc.data() ? chatInvolves.every((x) => {return doc.data().involves.includes(x)}) : false}).map(doc => ({
      _id: doc.data()._id,
      createdAt: doc.data().createdAt.toDate(),
      text: doc.data().text,
      user: doc.data().user
  }));

  return collectList;
}

const setSnapshotById = (collect, docId, action) => {
  const unsubscribe = onSnapshot( doc(db, collect, docId), action)
  
  return unsubscribe
}

export { auth, db, uiConfig ,tempHouseProfileImage, tempUserProfileImage,arrayRemove,capitalize ,capitalizeAll , getUserArrayFromPartnersDict,getByDocIdFromFirestore, getCollectionFromFirestore, 
        getWhereFromFirestore, deleteRowFromFirestore, addDocByIdToFirestore, addUserToFirestore,addDocToFirestore, updateCollectAtFirestore, updateDocAllColsAtFirestore,
        setDefaultHousePartners ,addHouseToFirestore, replaceUpdatedHouseToFirestore, updateHousePartners, updateHouseAtFirestore,getHousesByUserEmail, getHouseKeyByNameAndCreatorEmail, 
        getDocFromFirestoreByKeySubString,getUCollectionFromFirestoreByUserNameSubString,
        getHousePartnersByKey, getHouseIncome, getCurentPartnerOfHouse, addExpendToHouse,addIncomeToHouse ,addUserSelfIncome, removeUserSelfIncome, removeExpendFromHouse, removeIncomeFromHouse, shoppingListToString, 
        getHouseExpendsAmount ,getSortedArrayDateFromDict, getStrDateAndTimeToViewFromSrtDate, getStrDateToViewFromSrtDate, changePartnerIncomeOfHouse, getUserIncomeToHouse, getUserIncomeOrExpendsToHouseByMonth,
        addProductToFirestore, getExpenditureTypeAutoByOptionalDescription, getExpenditureTypeAutoByCompany, updateExpendsAndIncomes, getChatFromFirestore, setSnapshotById } 

