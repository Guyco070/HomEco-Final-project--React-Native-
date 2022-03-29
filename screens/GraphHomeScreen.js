import React, { useEffect,useState,Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox ,Dimensions,AppRegistry,Platform } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as firebase from '../firebase'
import * as Graphs from '../Graphs'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Inputs';
import { Button } from 'react-native-elements/dist/buttons/Button';
import TouchableScale from 'react-native-touchable-scale';
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit";
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLegend, VictoryTheme } from "victory-native";

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const GraphHomeScreen = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [hKey, setHKey] = useState('');
    const [house, setHouse] = useState(''); // first get, no update from dta base
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); })    // before opening the page

    }, [])
    useEffect(() => {    
        if("hKey" in route.params){ 
            setHKey(route.params)
            firebase.getByDocIdFromFirestore("houses",route.params.hKey).then((uHouse)=>setHouse(uHouse)).catch((e) =>{})
            getDataBar();
        }else console.log(route.params)
    }, [route])

    
    const GraphColor = ['#0000FF','#FF0000','#008000','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0','#FF0000','#008000','#A52A2A','#8A2BE2','#FF7F50','#FFD700','#ADD8E6','#FF4500','#40E0D0']

    const getPieChartData = () => {
        let Data=[]
        let j=0
        let tempAmount={}
        let temp={}
        for(let i in house.expends){
            if(house.expends[i].desc in tempAmount)
                 tempAmount[house.expends[i].desc] += parseFloat(house.expends[i].amount)
            else tempAmount[house.expends[i].desc] = parseFloat(house.expends[i].amount) 
            
        }
        for(let k in tempAmount){
            temp={
                name:k,
                population:tempAmount[k],
                color:GraphColor[j],
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
            j+=1
            Data.push(temp)
        }
        return Data
    }

    const screenWidth = Dimensions.get("window").width

      
    const chartPieConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
////////////////////////////////////
const dataBar=null
const getDataBar = async () => {
    await delay(5000);
    dataBar = Graphs.getBarChartData(house)
    
}



////////////////////////////////////

      
    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View>
                <Text>Bezier Line Chart</Text>
                <PieChart
                    data={getPieChartData()}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartPieConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"40"}
                    center={[10, 10]}
                    absolute={false}
                    />
            </View>

            {house !='' && <View>
                <VictoryChart>
                    <VictoryGroup offset={15}>
                        <VictoryBar data={dataBar["Expenditure"]} 
                                    barWidth={15}
                                    style={{
                                        data: {
                                            fill:'blue',
                                        },
                                    }}                        
                        />
                        <VictoryBar data={dataBar["Income"]}
                                    barWidth={15}
                                    style={{
                                        data: {
                                            fill:'orange',
                                        },
                                    }}                     
                        />
                    </VictoryGroup>
                    <VictoryLegend
                        x={Dimensions.get('screen').width / 2 - 70}
                        orientation="horizontal"
                        data={[
                            {
                                name:'Income',
                                symbol: {
                                    fill:'blue',
                                },
                            },
                            {
                                name:'Expenditure',
                                symbol: {
                                    fill:'orange'
                                },
                            },
                        ]}
                    />
                </VictoryChart>
            </View>}
        </ScrollView>
    );
}

export default GraphHomeScreen