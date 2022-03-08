import React, { useState, useEffect } from 'react';
import FontAwesomeIcon from 'react-native-fontawesome'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
// import { TodoSheet } from '../../styleSheet';
import { Input } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { styles, TodoSheet } from '../../styleSheet';
import { TextInput } from 'react-native-gesture-handler';
import BarcodeScanner from '../BarcodeScanner';
import { Modal } from 'react-native';
import * as firebase from '../../firebase'
import Toast from 'react-native-toast-message';


const TodoList = ({hKey,listName}) => {
	// HINT: each "item" in our list names a name,
	// a boolean to tell if its been completed, and a quantity
	const [items, setItems] = useState([]);

	const [inputValue, setinputValue] = useState('');
	const [totalItemCount, setTotalItemCount] = useState(6);

	const [isChanged, setIsChanged] = useState(false);

	const [isExpended, setIsExpended] = useState(false);
	const [slice, setSlice] = useState(3);
	const [isScanning, setIsScanning] = useState(false);

	useEffect(() => {
		if(listName == "shoppingList")
        	firebase.getByDocIdFromFirestore('houses', hKey).then((house) => setItems(house.shoppingList))
      },[])

	  useEffect(() => {
		if(items && items.length>0)
			firebase.updateCollectAtFirestore("houses", hKey, listName, items)
					.then(firebase.getByDocIdFromFirestore('houses', hKey)
								.then((house) => {if('shoppingList' in house) setItems(house.shoppingList)}))
      },[isChanged])

	const handleAddButtonClick = () => {
		handleAddButtonClickGetVal(inputValue)
	};

	const handleAddButtonClickGetVal = (inputValue) => {
		if(inputValue){
			let isIn = -1
			for(let i in items)
				if(items[i].itemName == inputValue){
					isIn = i
					break
				}
			
			if(isIn != -1){
				if(items[isIn].isSelected){
					items[isIn].isSelected = false
				}handleQuantityIncrease(isIn)

				Toast .show({
					type: 'success',
					text1: 'Hoo! Product quantity increased by one !',
					text2: inputValue 
				  });
			}else{
				const newItem = {
					itemName: inputValue,
					quantity: 1,
					isSelected: false,
				};
				const newItems = [...items, newItem];
				setSlice(items.length+1)
				setItems(newItems);
				setinputValue('');
				calculateTotal();
				setIsExpended(true)
				setIsChanged(!isChanged)
				Toast .show({
					type: 'success',
					text1: 'Hoo! something new just added to the list !',
					text2: inputValue
				  });
			}
		}
	};

	const handleQuantityIncrease = (index) => {
		const newItems = [...items];

		newItems[index].quantity++;

		setItems(newItems);
		calculateTotal();

		setIsChanged(!isChanged)
	};

	const handleQuantityDecrease = (index) => {
		const newItems = [...items];
		if(newItems[index].quantity>0){
			newItems[index].quantity--;

			setItems(newItems);
			calculateTotal();
			setIsChanged(!isChanged)
		}
	};

	const toggleComplete = (index) => {
		const newItems = [...items];

		newItems[index].isSelected = !newItems[index].isSelected;

		setItems(newItems);
		setIsChanged(!isChanged)
	};

	const handleRemove = (index) => {
		const newItems = [...items];		
		setItems(firebase.arrayRemove(newItems,newItems[index]));
		setIsChanged(!isChanged)
	};

	const calculateTotal = () => {
		const totalItemCount = items.reduce((total, item) => {
			return total + item.quantity;
		}, 0);

		setTotalItemCount(totalItemCount);
	};

	return (
		<View style={TodoSheet.appbackground}>
			<View style={TodoSheet.maincontainer}>
				<View style={TodoSheet.additembox}>
					<TouchableOpacity style={{marginHorizontal:5}} onPress={() => setIsScanning(!isScanning)}>
						<Icon name="scan-circle-outline"  type="ionicon" color={"grey"} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleAddButtonClick()}>
						<Icon name="add-outline"  type="ionicon" color={"grey"} />
					</TouchableOpacity>
					<TextInput style={TodoSheet.additeminput} value={inputValue} onChangeText={(text) => setinputValue(text)} placeholder='Add an item...' />
				</View>
				<View style={TodoSheet.itemlist}>
					{ items && items.slice(0,slice).map((item, index) => (
						<View style={TodoSheet.itemcontainer}>
							<View style={TodoSheet.itemname}>
								{item.isSelected ? (
									<View style={{flexDirection:"row"}}>
										<TouchableOpacity onPress={() => toggleComplete(index)}>
											<Icon name="checkmark-circle-outline"  type="ionicon"/>
										</TouchableOpacity>
										<Text style={TodoSheet.completed}>{item.itemName}</Text>
									</View>
								) : (
									<View style={{flexDirection:"row"}}>
										<TouchableOpacity onPress={() => toggleComplete(index)}>
											<Icon name="ellipse-outline"  type="ionicon"/>
										</TouchableOpacity>
										<Text style={{marginHorizontal:7,maxWidth:'70%'}}>{item.itemName}</Text>
									</View>
								)}
							</View>
							<View style={TodoSheet.trash}>
								{item.isSelected ? 
								<TouchableOpacity style={{marginHorizontal:25} } onPress={() => handleRemove(index)}>
									<Icon name="trash"  type="ionicon"/>
								</TouchableOpacity>
								:
								<View style={TodoSheet.quantity}>
									<TouchableOpacity onPress={() => handleQuantityDecrease(index)}>
										<Icon name="chevron-forward-outline" type="ionicon" /> 
									</TouchableOpacity>
									<Text> {item.quantity} </Text>
									<TouchableOpacity onPress={() => handleQuantityIncrease(index)}>
										<Icon type="ionicon" name="chevron-back-outline"  />
									</TouchableOpacity>
								</View>}	
							</View>
						</View>
					))}
					
				</View>
				<View style={{marginTop:4}}>
				{
					items &&
					<Text>View: {slice<items.length?slice:items.length}/{items.length}</Text>
				}
				{
					!items &&
					<Text>View: 0/0</Text>
				}
				{/* <Text>Total: {totalItemCount}</Text> */}
				</View>
				<View style={{flexDirection:"row" ,alignSelf:'center'}}>
					{ !isExpended ?
						<TouchableOpacity onPress={()=>{if(items) setSlice(items.length); setIsExpended(true)}}>
							<>
								<Icon
									name='chevron-down' size={22}  type='ionicon' />
							</>
						</TouchableOpacity>
						:
							<TouchableOpacity onPress={()=>{setSlice(3); setIsExpended(false)}}>
								<>
									<Icon name="chevron-up" size={22} type='ionicon'/>
								</>
							</TouchableOpacity>
						}
				</View>
				<Toast  position='bottom'
                 bottomOffset={20}
				 text1Style={{
					fontSize: 10,
					fontWeight: '400'
				  }}/>
			</View>

			{isScanning && 
			<Modal transparent={true} visible={true} >
				<ScrollView>
				<View >
					<BarcodeScanner hKey = {hKey} onScannExtraFunc={handleAddButtonClickGetVal} listName={listName} items={items} isScanningFunc={setIsScanning}/>
					<View style={[styles.buttonContainer,{alignSelf:'center', marginTop:5}]}>
						
						{/* {backgroundColor:"white, hight: 80% ", width:100, alignSelf:'center',alignItems:'center', borderWidth:1,borderRadius:10} */}
						{/* <TouchableOpacity style={[styles.button,{backgroundColor: 'rgba(7, 130, 249, 0.8)',flexDirection:'row'}]} onPress={() => setIsScanning(!isScanning)}>
							<Text style={[styles.buttonText, {marginRight:2}]}>Go Back</Text>
							<Icon name="return-up-back-outline" type="ionicon" color={'white'}/> 
						</TouchableOpacity> */}
					</View>

				</View>
				</ScrollView>
			</Modal>}
		</View>
	);
};
  
export default TodoList;
