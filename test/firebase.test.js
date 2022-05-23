import * as firebase from '../firebase'
import {describe, expect, test, it} from '@jest/globals'

describe('General', () => {

    // capitalize
    test('return Guy cohen when capitalizing guy cohen - true.', () => {
        expect(firebase.capitalize('guy cohen')).toEqual('Guy cohen')
    })

    test('return Guy cohen when capitalizing guy cohen - false.', () => {
        expect(firebase.capitalize('guy cohen')).not.toEqual('Guy Cohen')
    })
    
    // capitalizeAll
    test('return Guy Cohen when capitalizing all guy cohen - true.', () => {
        expect(firebase.capitalizeAll('guy cohen')).toEqual('Guy Cohen')
    })

    test('return Guy Cohen when capitalizing all guy cohen - false.', () => {
        expect(firebase.capitalizeAll('guy cohen')).not.toEqual('Guy cohen')
    })

    // arrayRemove
    test('return [1,3,1,3] when arrayRemove [1,2,3,1,2,3], 2 - true.', () => {
        expect(firebase.arrayRemove([1,2,3,1,2,3], 2)).toEqual([1,3,1,3])
    })

    test('return [1,3,1,3] when arrayRemove [1,2,3,1,2,3], 2 - false.', () => {
        expect(firebase.arrayRemove([1,2,3,1,2,3], 2)).not.toEqual([1,2,3,1,3])
    })

    // getStrDateAndTimeToViewFromSrtDate
    test('return 10.8.1994  0:00 when asking for string of date and time "08/10/1994" (object Date) - true.', () => {
        expect(firebase.getStrDateAndTimeToViewFromSrtDate(new Date("08/10/1994"))).toEqual("10.8.1994  0:00")
    })

    test('return 10.8.1994  0:00 when asking for string of date and time "08/10/1994" (object Date) - false.', () => {
        expect(firebase.getStrDateAndTimeToViewFromSrtDate(new Date("08/10/1994"))).not.toEqual("10.8.1994")
    })

    // getStrDateToViewFromSrtDate
    test('return 10.8.1994 when asking for string of date "08/10/1994" (object Date). - true', () => {
        expect(firebase.getStrDateToViewFromSrtDate(new Date("08/10/1994"))).toEqual("10.8.1994")
    })

    test('return 10.8.1994 when asking for string of date "08/10/1994" (object Date). - false', () => {
        expect(firebase.getStrDateToViewFromSrtDate(new Date("08/10/1994"))).not.toEqual("10.8.1994  0:00")
    })
})

describe('firestore', () => {

    // addDocToFirestore
    it('return true after adding doc to firestore', () => {
        return firebase.addDocToFirestore('test' ,{test: "test"}).then((x) => { 
            return expect(x).toBeTruthy()
        })
    })
    
    // addDocByIdToFirestore
    it('return true after adding doc with a chosen id to firestore', () => {
        return firebase.addDocByIdToFirestore('test',"testID",{test: "test"}).then((x) => { 
            return expect(x).toBeTruthy()
        })
    })

    // updateCollectAtFirestore
    it('return true after update doc value with a chosen id to firestore.', () => {
        return firebase.updateCollectAtFirestore('test',"testID","test","testUpdated1").then((x) => { 
            return expect(x).toBeTruthy()
        })
    })

    // updateDocAllColsAtFirestore
    it('return true after update all doc data with a chosen id to firestore.', () => {
        return firebase.updateDocAllColsAtFirestore('test',"testID",{test:"testUpdated"}).then((x) => { 
            return expect(x).toBeTruthy()
        })
    })
    
    // getByDocIdFromFirestore
    it('return object {test: "testUpdated"} after get doc by doc id=testID from test collection at firestore - true.', () => {
        return firebase.getByDocIdFromFirestore('test',"testID").then((x) => { 
            return expect(x).toEqual({test: "testUpdated"})
        })
    })

    it('return object {test: "testUpdated"} after get doc by doc id=testID from test collection at firestore - false - none exist collection.', () => {
        return firebase.getByDocIdFromFirestore('test2',"test").then((x) => { 
            return expect(x).toBeFalsy()
        })
    })

    it('return object {test: "testUpdated"} after get doc by doc id=testID from test collection at firestore - false -  none exist doc id.', () => {
        return firebase.getByDocIdFromFirestore('test',"zzzzzzzzzzz").then((x) => { 
            return expect(x).toBeFalsy()
        })
    })

    // getDocFromFirestoreByKeySubString
    it('return object [{test: "testUpdated"}] after get doc by substring doc id=te from test collection at firestore.', () => {
        return firebase.getDocFromFirestoreByKeySubString('test',"te").then((x) => { 
            return expect(x).toBeDefined()
        })
    })

    it('return object [{test: "testUpdated"}] after get doc by substring doc id=te from test collection at firestore - false - none exist collection.', () => {
        return firebase.getDocFromFirestoreByKeySubString('test1',"te").then((x) => { 
            return expect(x).toEqual([])
        })
    })

    it('return object [{test: "testUpdated"}] after get doc by substring doc id=te from test collection at firestore - false - none exist doc id.', () => {
        return firebase.getDocFromFirestoreByKeySubString('test',"zzzzzzzzzz").then((x) => { 
            return expect(x).toEqual([])
        })
    })

    // deleteRowFromFirestore
    it('return true after deleting doc by id from firestore', () => {
        return firebase.deleteRowFromFirestore('test' ,'testID').then((x) => { 
            return expect(x).toBeTruthy()
        })
    })

    // getCollectionFromFirestore
    it('return object that contain all of the collection data after asking for collection from firestore', () => {
        return firebase.getCollectionFromFirestore('test').then((x) => { 
            return expect(x).toBeDefined()
        })
    })

    it('return object that contain all of the collection data after asking for collection from firestore - false - none exist collection.', () => {
        return firebase.getCollectionFromFirestore('test2').then((x) => { 
            return expect(x).toEqual([])
        })
    })

    // getWhereFromFirestore
    it('return array that contain all the docs that fit to the tems (test===test) from firestore', () => {
        return expect(firebase.getWhereFromFirestore('test', "test", "===", "test")).toBeDefined()
    })
})

// getUserArrayFromPartnersDict, addUserToFirestore, setDefaultHousePartners ,addHouseToFirestore, replaceUpdatedHouseToFirestore, updateHousePartners, updateHouseAtFirestore,getHousesByUserEmail, getHouseKeyByNameAndCreatorEmail, 
//         ,getUCollectionFromFirestoreByUserNameSubString,
//         getHousePartnersByKey, getHouseIncome, getCurentPartnerOfHouse, addExpendToHouse,addIncomeToHouse ,addUserSelfIncome, removeUserSelfIncome, removeExpendFromHouse, removeIncomeFromHouse, shoppingListToString, 
//         getHouseExpendsAmount ,getSortedArrayDateFromDict, changePartnerIncomeOfHouse, getUserIncomeToHouse, getUserIncomeOrExpendsToHouseByMonth,
//         addProductToFirestore, getExpenditureTypeAutoByOptionalDescription, getExpenditureTypeAutoByCompany, updateExpendsAndIncomes, getChatFromFirestore, setSnapshotById 