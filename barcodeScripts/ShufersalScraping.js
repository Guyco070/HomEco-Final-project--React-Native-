import * as cheerio from 'react-native-cheerio'

const getDescriptionByUPC = async(upcCode) => {
    const response = await fetch('https://www.shufersal.co.il/online/he/search?text='+ upcCode)
    const text = await response.text()
    console.log("text")
    const $ = cheerio.load(text)
    // const liList = $("div","#productModal")
    // console.log(liList)
    // $(body,"div[class=modal-dialog]")
    const a = $("a[data-product-code=P_"+ upcCode +"]")

    // console.log(a.html())
    // console.log("a.html()")
 
    // if(a.html() == null) a = $("li[data-product-code=P_"+ upcCode +"]")
    // console.log(a.text())
    if(a.html() == null) return null
    const prod = {}
    prod["name"] = a.attr("title")
    prod["img"] = a.find("img").attr("src")
    // console.log($("a[data-product-code=P_"+ upcCode +"]"))
    const category = $("div[id=filterCollapsecategories-3]").find("span[class=searchName]").text()
    const detContainer = $("div[class=textContainer]")
    const det = detContainer.find("div[class=smallText]").text().trim().split("\n").map((x) => x.trim()).filter((x) => {return x!=""})
    let cost = detContainer.find("span[class=number]").text().trim().split(" ")
    cost = cost[cost.length-1] + " " + detContainer.find("span[aria-hidden=true]").text().trim()
    prod["costTo"] = det[0]
    prod["amount"] = det[1].split('|')[0].trim()
    prod["cost"] = cost
    prod["brand"] = det[2]
    prod["category"] = category
    console.log(prod)

    console.log("text")
    return prod
}


export {getDescriptionByUPC};