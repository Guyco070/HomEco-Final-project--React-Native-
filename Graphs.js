const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const GraphColor = ['#BCC6C8','#BE9F9D','#52b788','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0','#FF0000','#008000','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0',"#d90429"]

const getIndexOfMonthByName = (monthName) => {
  return monthNames.findIndex(m => m===monthName)
}

const getPieChartData = (house, month = new Date().getMonth(), year = new Date().getFullYear()) => {
  let Data=[]
  let j=0
  let tempAmount={}
  let temp={}
  let totalAmount = 0
  let startOfTheMonth = new Date(parseInt((month) + 1) + "/01/" + (parseInt(year)))
  let startOfNextMonth = new Date(parseInt((month) + 2) + "/01/" + (parseInt(year)))
  let array = Object.values(house.expends)
  array = array.filter((a)=>{return (a.date.toDate() >= startOfTheMonth && a.date.toDate() < startOfNextMonth)})

  for(let i in array){
    if(array[i].date)
      if(array[i].desc in tempAmount)
           tempAmount[array[i].desc] += parseFloat(array[i].amount)
      else tempAmount[array[i].desc] = parseFloat(array[i].amount) 
      totalAmount +=  parseFloat(array[i].amount) 
  }
  for(let k in tempAmount){
      const presentege = (tempAmount[k] / totalAmount * 100).toFixed(0) + "%"
      temp={
          name:k,
          label: k + "\n" + presentege,
          y: Number(tempAmount[k]),
          expenseCount: array.length,
          color: GraphColor[j],
          id: j,
          presentege
      }
      j+=1
      Data.push(temp)
  }

  return Data.sort((e1, e2) => e1.y - e2.y)
}


const getAmountMonth = (dict) => {
  let array = Object.values(dict)
  let lastYearDate = new Date()
  lastYearDate = new Date(parseInt((lastYearDate.getMonth()) + 1) + "/02/" + (parseInt(lastYearDate.getFullYear()) - 1))
  array = array.filter((a)=>{return a.date.toDate() >= lastYearDate}) // The last yaer fron the first of the month expenditures

  array = array.sort((a,b) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return a.date.toDate() - b.date.toDate()
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

// const getIncomeMonth = (dict) => {
//   let IncomeArray = Object.values(dict)
//   console.log(IncomeArray[1]["incomeToCurHouse"])
//   let lastYearDate = new Date()
//   lastYearDate = new Date(parseInt((lastYearDate.getMonth()) + 1) + "/02/" + (parseInt(lastYearDate.getFullYear()) - 1))
//   IncomeArray = IncomeArray.filter((a)=>{return a.user}) // The last yaer fron the first of the month expenditures

//   IncomeArray = IncomeArray.sort((a,b) => {
//     // Turn your strings into dates, and then subtract them
//     // to get a value that is either negative, positive, or zero.
//     return b.date.toDate() - a.date.toDate()
//   }); 
//   console.log("bbbbbbbbbb")
//   let amountMonthIncome = {}
//   for(let i in IncomeArray){
//     for(let j in IncomeArray[i].user["incomes"])
//       console.log(IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1)
//       break;
//      if(monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear() in amountMonthIncome) 
//        amountMonthIncome[monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear()] += parseInt(IncomeArray[i].user["incomes"][j].amount)
//      else amountMonthIncome[monthNames[IncomeArray[i].user["incomes"][j].date.toDate().getMonth()+1] + '\n' + IncomeArray[i].user["incomes"][j].date.toDate().getFullYear()] = parseInt(IncomeArray[i].user["incomes"][j].amount)
//   //console.log(array[i].user["incomes"][j].date.toDate().getMonth()+1)
//   //console.log(array[i].user["incomes"][j].amount) 
//   }

//    return amountMonthIncome
// }

const getBarChartData = (dict) => {
  let ExpenditureMonth=getAmountMonth(dict.expends)
  let IncomMonth=getAmountMonth(dict.incomes)
  const IncomMonthLenght = Object.keys(IncomMonth).length
  const ExpenditureMonthLenght = Object.keys(ExpenditureMonth).length
  const data = {Expenditure:[],Income:[]}
  let toGoBy = ExpenditureMonthLenght > IncomMonthLenght ? ExpenditureMonth : IncomMonth
  
   for(let i in toGoBy){
        data["Expenditure"].push({x:i,y:  i in ExpenditureMonth ? ExpenditureMonth[i] : 0})
        data["Income"].push({x:i,y: i in IncomMonth ? IncomMonth[i] : 0})
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

export {monthNames,GraphColor, getAmountMonth, getBarChartData, getPieChartData, getIndexOfMonthByName }