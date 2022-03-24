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
  //console.log(array)
  let amountMonth = {}
  for(let i in array){
    if(monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear() in amountMonth) 
      amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] += parseInt(array[i].amount)
    else amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] = parseInt(array[i].amount)
  }
  return amountMonth
}

const getIncomeMonth = (dict) => {
  // let array = Object.values(dict)
  console.log(dict)
  // let lastYearDate = new Date()
  // lastYearDate = new Date(parseInt((lastYearDate.getMonth()) + 1) + "/02/" + (parseInt(lastYearDate.getFullYear()) - 1))
  // array = array.filter((a)=>{return a.date.toDate() >= lastYearDate}) // The last yaer fron the first of the month expenditures

  // array = array.sort((a,b) => {
  //   // Turn your strings into dates, and then subtract them
  //   // to get a value that is either negative, positive, or zero.
  //   return b.date.toDate() - a.date.toDate()
  // }); 
  // console.log(array)
  // let amountMonth = {}
  // for(let i in array){
  //   if(monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear() in amountMonth) 
  //     amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] += parseInt(array[i].amount)
  //   else amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] = parseInt(array[i].amount)
  // }
  // return amountMonth
}

const getBarChartData = (dict) => {
  console.log(dict.expends)
  let amountMonth=getAmountMonth(dict.expends)
  let IncomMonthe=getIncomeMonth(dict.partners)
  const data = {Expenditure:[],Income:[]}
   for(let i in amountMonth){
        data["Expenditure"].push({x:i,y:amountMonth[i]})
        data["Income"].push({x:i,y:50})
   }
   return data
};


// const dataBar = {
//     Expenditure: [null,{x:'May 5',y:20}],
//     Income: [
//         {x:'April 4' , y:50},
//         {x:'May 5' , y:60},
//     ],
// };

export {getAmountMonth, getBarChartData}