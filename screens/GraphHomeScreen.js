import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
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
    const [house, setHouse] = useState(''); // first get, no update from dta base


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); })    // before opening the page

    }, [])
    useEffect(() => {    
        if("hKeyP" in route.params){
            console.log(route.params.hKeyP)    
            setHKey(route.params.hKeyP)
            firebase.getByDocIdFromFirestore("houses",route.params.hKeyP).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
        }
    }, [route])
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View>
                <Text>Bezier Line Chart</Text>
                <LineChart
                    data={{
                    labels: ["January", "February", "March", "April", "May", "June"],
                    datasets: [
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                        }
                    ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                />
            </View>
        </ScrollView>
    )
}



    export default GraphHomeScreen