const sortDispatch = {1: (arr) => sortByDateOldToNew(arr), 2: (arr) => sortByDateNewToOld(arr), 3: (arr) => sortByAmountHighToLow(arr),4: (arr) => sortByAmountLowToHigh(arr)}
const filterDispatch = {1: (arr) => sortByDateOldToNew(arr), 2: (arr) => sortByDateNewToOld(arr), 3: (arr) => sortByAmountHighToLow(arr),4: (arr) => sortByAmountLowToHigh(arr)}

// sortDispatch - start
const sortByDateOldToNew = (arr) => {
    console.log(arr)
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.date.toDate() - a.date.toDate()
    }); 
}

const sortByDateNewToOld = (arr) => {
    console.log(arr)
    if(arr.length == 1) return [arr[0]]
    return arr.sort((a,b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.date.toDate() - b.date.toDate()
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


export {sortDispatch,filterDispatch, sortByDateOldToNew, sortByDateNewToOld, sortByAmountHighToLow, sortByAmountLowToHigh}