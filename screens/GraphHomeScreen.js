import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox ,Dimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Inputs';
import { Button } from 'react-native-elements/dist/buttons/Button';
import TouchableScale from 'react-native-touchable-scale';
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit";


const GraphHomeScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [hKey, setHKey] = useState('');
    const [house, setHouse] = useState(''); // first get, no update from dta base


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); })    // before opening the page

    }, [])
    useEffect(() => {    
        if("hKey" in route.params){ 
            setHKey(route.params)
            firebase.getByDocIdFromFirestore("houses",route.params.hKey).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
        }else console.log(route.params)
    }, [route])
    const GraphColor = ['#0000FF','#FF0000','#008000','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0','#FF0000','#008000','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0']

    const getData = () => {
        let Data=[]
        let j=0
        let temp={};
        for(let i in house.expends){
            if(house.expends[i].desc in temp)
                temp[house.expends[i].desc] += house.expends[i].amount
            else temp[house.expends[i].desc] = house.expends[i].amount
            console.log(Data) 
            // temp = {
            //     name:house.expends[i].desc,
            //     population:parseFloat(house.expends[i].amount),
            //     color:GraphColor[j],
            //     legendFontColor: "#7F7F7F",
            //     legendFontSize: 15
            //  }
             Data.push(temp)
             j+=1
        }
        return Data
    }

    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
    };
      
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View>
                <Text>Bezier Line Chart</Text>
                <PieChart
                    data={getData()}
                    width={screenWidth}
                    height={300}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"30"}
                    center={[10, 50]}
                    absolute={false}
                    />
            </View>
        </ScrollView>
    )
}



    export default GraphHomeScreen