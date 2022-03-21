const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getAmountMonth = (dict) => {
  let array = Object.values(dict)

  let lastYearDate = new Date()
  lastYearDate = new Date(parseInt((lastYearDate.getMonth()) + 1) + "/02/" + (parseInt(lastYearDate.getFullYear()) - 1))
  array = array.filter((a)=>{return a.date.toDate() >= lastYearDate}) // The last yaer fron the first of the month expenditures

  array = array.sort((a,b) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return b.date.toDate() - a.date.toDate()
  }); 

  let amountMonth = {}
  for(let i in array){
    if(monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear() in amountMonth) 
      amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] += parseInt(array[i].amount)
    else amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] = parseInt(array[i].amount)
  }
  console.log(amountMonth)
  return amountMonth
}

export {getAmountMonth}