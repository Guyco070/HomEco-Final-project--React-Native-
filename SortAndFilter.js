const sortDispatch = {1: (arr) => sortByDateOldToNew(arr), 2: (arr) => sortByDateNewToOld(arr), 3: (arr) => sortByAmountHighToLow(arr),4: (arr) => sortByAmountLowToHigh(arr)}
const filterOptionsDispatch = {1: (arr) => getUserEmailOptions(arr), 2: (arr) => getTypeOptions(arr), 3: (arr) => getBillingTypeOptions(arr),4: (arr) => getCompanyOptions(arr),5: (arr) => getDescriptionOptions(arr),6: (arr) => getMonthOptions(arr),7: (arr) => getYearOptions(arr)}
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const filterBy = {"User email": "partner", "Type": "desc", "Billing type": "billingType", "Company": "company", "Description": "descOpitional"};
// sortDispatch - start
const sortByDateOldToNew = (arr) => {
    console.log(arr)
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.date.toDate() - b.date.toDate()
    }); 
}

const sortByDateNewToOld = (arr) => {
    console.log(arr)
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.date.toDate() - a.date.toDate()
    }); 
  }

    const sortByAmountHighToLow = (arr) => {
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.amount - a.amount
    }); 
  }
  
  const sortByAmountLowToHigh = (arr) => {
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.amount - b.amount
    }); 
  }
// sortDispatch - end

// filterOptionsDispatch - start
const getUserEmailOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { return exp.partner }))).map((email) => { return {key: i++, label: email,} }); 
  } 
  const getTypeOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    return Array.from(new Set(arr.map((exp) => { return exp.desc }))).map((type) => { return {key: type, label: type,} }); 
  } 
  const getBillingTypeOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { return exp.billingType }))).map((billingType) => { return {key: i++, label: billingType,} }); 
  } 
  const getCompanyOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { return exp.company }))).map((company) => { return {key: i++, label: company,} }); 
  } 
  const getDescriptionOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { if("descOpitional" in exp && exp.descOpitional != '') return exp.descOpitional }))).map((descOpitional) => { return {key: i++, label: descOpitional,} }); 
  } 
  const getMonthOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { return parseInt(exp.date.toDate().getMonth()) }))).map((month) => { return {key: i++, label: monthNames[month],} }); 
  } 
  const getYearOptions = (arr) => {
    if(arr.length == 1) return [arr[0].partner]
    let i = 0
    return Array.from(new Set(arr.map((exp) => { return exp.date.toDate().getFullYear() }))).map((year) => { return {key: i++, label: "" + year,} }); 
  } 
// filterOptionsDispatch - end

// filterDispatch - start

const filterByFunc = (arr,by,val) => {
    if(by == 'Month') return arr.filter((exp) => { return monthNames[parseInt(exp.date.toDate().getMonth())] === val }); 
    if(by == 'Year') return arr.filter((exp) => { return "" + exp.date.toDate().getFullYear() === val }); 
    return arr.filter((exp) => { return exp[filterBy[by]] === val }); 
  }

// filterDispatch - end
export {sortDispatch,filterOptionsDispatch,filterByFunc, sortByDateOldToNew, sortByDateNewToOld, sortByAmountHighToLow, sortByAmountLowToHigh}