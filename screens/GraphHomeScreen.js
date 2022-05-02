import React, { useEffect,useState,Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox ,Dimensions,AppRegistry,Platform,ActivityIndicator } from "react-native";
import * as firebase from '../firebase'
import * as Graphs from '../Graphs'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Inputs';
import { Button } from 'react-native-elements/dist/buttons/Button';
import TouchableScale from 'react-native-touchable-scale';
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit";
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLegend, VictoryTheme, VictoryPie, VictoryAxis} from "victory-native";
import Loading from '../components/Loading';
import { deviceWidth } from '../SIZES';
import SeperatorSwitch from '../components/SeperatorSwitch';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown'
import { getArrayOfMonthOptionsByYear, getYearOptionsToGraph } from '../SortAndFilter';

LogBox.ignoreAllLogs(true)


const GraphHomeScreen = ({route, scrollHandler}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState([]);
    const [hKey, setHKey] = useState('');
    const [house, setHouse] = useState(''); // first get, no update from dta base
    const [dataBar, setDataBar] = useState(''); 
    const [dataPie, setDataPie] = useState('')
    const [showPieChart, setShowPieChart] = useState(true);
    const [pieChartMonth, setPieChartMonth] = useState(Graphs.monthNames[new Date().getMonth()]);
    const [pieChartYear, setPieChartYear] = useState(new Date().getFullYear());

    const [showBarChart, setShowBarChart] = useState(false);


    useEffect(() => {
        firebase.getByDocIdFromFirestore("users", firebase.auth.currentUser?.email).then( (us) => { setUser(us); })    // before opening the page
    }, [])

    useEffect(() => {    
        if("hKey" in route.params){ 
            setHKey(route.params)
            firebase.getByDocIdFromFirestore("houses",route.params.hKey).then((uHouse)=>{ setHouse(uHouse); setDataBar(Graphs.getBarChartData(uHouse)); setDataPie(Graphs.getPieChartData(uHouse)) }).catch((e) =>{})
        }else console.log(route.params)
    }, [route])

    useEffect(() => {
        if(scrollHandler && house) scrollHandler();
    },[scrollHandler,house])


    const renderChart = () => {
        const expendsCount = Object.keys(house.expends).length
        let x = 15

        return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection:"row" }} >
                    {pieChartYear && pieChartMonth && <SelectDropdown
                        buttonStyle = {{ height: 30, borderRadius: 6, flexDirection:'row',width: 121}}
                        defaultValue={pieChartMonth}
                        data={getArrayOfMonthOptionsByYear(house.expends, pieChartYear)}
                        onSelect={(selectedItem, index) => {
                            setDataPie(Graphs.getPieChartData(house, Graphs.getIndexOfMonthByName(selectedItem), pieChartYear))
                            setPieChartMonth(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        // rowTextForSelection={(item, index) => {
                        //     // text represented for each item in dropdown
                        //     // if data array is an array of objects then return item.property to represent item in dropdown
                        //     return item
                        // }}
                    />}
                    <SelectDropdown
                        buttonStyle = {{ height: 30, borderRadius: 6, flexDirection:'row',width: 80, marginLeft:5}}
                        defaultValue={pieChartYear}
                        data={getYearOptionsToGraph(house.expends)}
                        onSelect={(selectedItem, index) => {
                            let data = Graphs.getPieChartData(house, Graphs.getIndexOfMonthByName(pieChartMonth), selectedItem)
                            if(data.length === 0){
                                const tempArray = getArrayOfMonthOptionsByYear(house.expends, selectedItem)
                                const month = tempArray.length !== 0 ? tempArray[tempArray.length-1] : ''
                                setDataPie(Graphs.getPieChartData(house, Graphs.getIndexOfMonthByName(month), selectedItem))
                                setPieChartMonth(month)
                            }else setDataPie(data)
                            setPieChartYear(selectedItem)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected 
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        // rowTextForSelection={(item, index) => {
                        //     // text represented for each item in dropdown
                        //     // if data array is an array of objects then return item.property to represent item in dropdown
                        //     return item
                        // }}
                    /><Text> expenses:{"\n"}</Text>
                </View>
                {dataPie.length === 0?  <Text>No expenses at {pieChartMonth}</Text> :
                <>
            
                    <VictoryPie
                        data={dataPie}
                        colorScale={dataPie.map((d) => d.color )}
                        radius={ () => {x -= 15/expendsCount; return deviceWidth * 0.4 - x}}
                        innerRadius={70}
                        labelRadius={({ innerRadius }) => (deviceWidth * 0.4 + innerRadius) / 2.5}
                        style={{
                            labels: { fill: "white" },
                            parent: { ...styles.shadow }
                        }}
                        width={deviceWidth * 0.8}
                        height={deviceWidth * 0.8}
                        
                    />
                    <View style={{ position:"absolute", top: "45%", left: "41%"}}>
                        <Text style={ styles.amountText }>{dataPie.length}</Text>
                        <Text style={ styles.text } >Expenses</Text>
                    </View>
                </>}
            </View>
        )
    }

    const renderExpensesSummary = () => {
        const renderItem = ({item}) => {
            return (
                <View style = {{ flexDirection: "row", marginHorizontal:15, marginVertical:3, justifyContent:'space-between', backgroundColor: item.color, borderRadius: 7 }}>
                    <View style = {{ flexDirection: "row", alignItems: "center"}}>
                        <View 
                        style={{
                            width:20,
                            height:20,
                            backgroundColor: item.color,
                            borderRadius: 6, 
                            marginHorizontal: 8
                        }}></View>
                        <Text>{item.name}</Text>
                    </View>
                    <View style = {{ flexDirection: "row", alignItems: "center", margin: 10}}>
                        <Text style={{color:"white",}} >{item.y} USD - {item.presentege}</Text>
                    </View>
                </View>

            )            
        }

        return (<View>
            <FlatList 
                data={dataPie}
                renderItem={renderItem}
            />
        </View>)
    }
      
    return (
        <ScrollView style={{backgroundColor: 'white', width:"100%", marginBottom: 40}}>
            {/* <View>
                <PieChart
                    data={getPieChartData()}
                    width={deviceWidth}
                    height={200}
                    chartConfig={chartPieConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    center={[10, 10]}
                    absolute={false}
                    />
            </View> */}
            { dataPie === '' ? <Loading/> : <>
            {pieChartYear && <SeperatorSwitch isExpended={showPieChart} setIsExpended={setShowPieChart} title= {"Month Pie Chart"} bottomDevider={!showPieChart} />}
            {showPieChart && dataPie !=='' && renderChart()}
            {showPieChart && dataPie !=='' && renderExpensesSummary()}

            <SeperatorSwitch isExpended={showBarChart} setIsExpended={setShowBarChart} title="Year Bar  Chart" topDevider={showPieChart} bottomDevider={!showBarChart} />
            {(showBarChart && house !=='') && <View style={{ alignItems: "center"}}>
            <Text>Last year expenses{"\n"}</Text>
                <ScrollView horizontal style={{ marginStart: 10 }}>
                    <VictoryChart width={ (dataBar["Expenditure"].length + dataBar["Income"].length) * 40 }>
                        <VictoryAxis label={""} style={{ 
                                axisLabel:{
                                    padding: 40,
                                    margin:40
                                }
                            }}/>
                        <VictoryAxis dependentAxis label={"Amount"}  style={{ 
                                axisLabel:{
                                    padding: 35,
                                    fontSize: 16
                                }
                            }}/>

                        <VictoryGroup offset={20} >
                            <VictoryBar data={dataBar["Expenditure"]} 
                                        barWidth={20}
                                        style={{
                                            data: {
                                                fill: Graphs.GraphColor[5],
                                            },
                                        }}
                                        animate={{
                                            duration: 2000,
                                            onLoad: {duration: 1000},
                                          }}
                                          cornerRadius={6}                 
                            /> 
                            <VictoryBar data={dataBar["Income"]}
                                        barWidth={20}
                                        style={{
                                            data: {
                                                fill:Graphs.GraphColor[7],
                                            },
                                        }}
                                        animate={{
                                            duration: 2000,
                                            onLoad: {duration: 1000},
                                          }}
                                          cornerRadius={6}                 
                            />
                        </VictoryGroup>
                        <VictoryLegend
                            x={Dimensions.get('screen').width / 2 - 100}
                            orientation="horizontal"
                            gutter={25}
                            data={[
                                {
                                    name:'Incomes',
                                    symbol: {
                                        fill: Graphs.GraphColor[7],
                                    },
                                },
                                {
                                    name:'Expenses',
                                    symbol: {
                                        fill: Graphs.GraphColor[5],
                                    },
                                },
                            ]}
                        />
                        
                    </VictoryChart>
                    
                </ScrollView>
                <View style={{ flexDirection:"row",justifyContent:'space-around', width: "100%" }}>
                    <Text>     </Text>
                    <Text>Month</Text>
                    <Icon name= { "arrowright"} size={22}  type='antdesign' />
                </View>
            </View>}
            </>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    amountText: {
        fontSize: 28,
        alignSelf: "center",
        fontWeight: "bold"
    },
    text: {
        fontSize: 15,
        alignSelf: "center"
    },
})

export default GraphHomeScreen