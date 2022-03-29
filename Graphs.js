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
    //console.log(array[i].date.toDate())
    if(monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear() in amountMonth) 
      amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] += parseInt(array[i].amount)
    else amountMonth[monthNames[array[i].date.toDate().getMonth()] + '\n' + array[i].date.toDate().getFullYear()] = parseInt(array[i].amount)
  }
  return amountMonth
}

const getIncomeMonth = (dict) => {
  let IncomeArray = Object.values(dict)
  console.log(IncomeArray[1]["incomeToCurHouse"])
  // let lastYearDate = new Date()
  // lastYearDate = new Date(parseInt((lastYearDate.getMonth()) + 1) + "/02/" + (parseInt(lastYearDate.getFullYear()) - 1))
  // IncomeArray = IncomeArray.filter((a)=>{return a.user}) // The last yaer fron the first of the month expenditures

  // IncomeArray = IncomeArray.sort((a,b) => {
  //   // Turn your strings into dates, and then subtract them
  //   // to get a value that is either negative, positive, or zero.
  //   return b.date.toDate() - a.date.toDate()
  // }); 
  // console.log("bbbbbbbbbb")
  // let amountMonthIncome = {}
  // for(let i in IncomeArray){
  //   for(let j in IncomeArray[i].user["incomes"])
  //     console.log(IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1)
  //     break;
  //    if(monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear() in amountMonthIncome) 
  //      amountMonthIncome[monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear()] += parseInt(IncomeArray[i].user["incomes"][j].amount)
  //    else amountMonthIncome[monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear()] = parseInt(IncomeArray[i].user["incomes"][j].amount)
  // //console.log(array[i].user["incomes"][j].date.toDate().getMonth()+1)
  // //console.log(array[i].user["incomes"][j].amount) 
  // }

   return amountMonthIncome
}

const getBarChartData = (dict) => {
  //console.log(dict.expends)
  let amountMonth=getAmountMonth(dict.expends)
  let IncomMonth=Object.values(dict.partners)
  let HouseIncome=0
  for(let i in IncomMonth){
    HouseIncome+=parseFloat(IncomMonth[i]["incomeToCurHouse"])
  }
  console.log(HouseIncome)
  const data = {Expenditure:[],Income:[]}
  let j=0
   for(let i in amountMonth){
        data["Expenditure"].push({x:i,y:amountMonth[i]})
        data["Income"].push({x:i,y:HouseIncome})
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