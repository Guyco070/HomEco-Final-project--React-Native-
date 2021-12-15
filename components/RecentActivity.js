import React, { useEffect,useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, LogBox } from "react-native";
import Loading from '../components/Loading';
import { getSortedArrayDateFromDict, getSrtDateAndTimeToViewFromSrtDate } from '../firebase';
import { styles,houseProfileStyles } from '../styleSheet';

const RecentActivity = ({map,slice}) => {
    const [loading, setLoading] = useState(true);
    const [sorteList, setSorteList] = useState(true);

    

    useEffect(() => {
        setSorteList(getSortedArrayDateFromDict(map))
      },[map])

      useEffect(() => {
        setLoading(false);
      },[sorteList])

    return (
        <View>
        {loading?(<Loading/>) :
        (<ScrollView 
        style={{width:'80%',}}
        >  
        <Text style={[houseProfileStyles.subText, houseProfileStyles.recent]}>Recent Activity</Text>

            {sorteList &&  sorteList.slice(0,slice)
                        .map((l, i) => 
                        (
                            <View>
                                <View style={[styles.container],{ alignItems: "center" }}>
                                    <View style={houseProfileStyles.recentItem}>
                                        <View style={houseProfileStyles.activityIndicator}>
                                        </View>
                                            <View style={{ width: 250 }}>
                                                <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                                    <Text style={{ fontWeight: "400" }}>{getSrtDateAndTimeToViewFromSrtDate((l.date.toDate()))}</Text>
                                                    {"\n"}Company: <Text style={{ fontWeight: "400" }}>{l.company}</Text>
                                                    {"\n"}Description: <Text style={{ fontWeight: "400" }}>{l.desc}</Text>
                                                    {"\n"}Billing type: <Text style={{ fontWeight: "400" }}>{l.billingType}</Text>
                                                    {"\n"}Amount: <Text style={{ fontWeight: "400" }}>{l.amount} $</Text>
                                                </Text>
                                            </View>
                                    </View>

                                    {/* <View style={houseProfileStyles.recentItem}>
                                        <View style={houseProfileStyles.activityIndicator}>
                                        </View>
                                            <View style={{ width: 250 }}>
                                                <Text style={[houseProfileStyles.text, { color: "#41444B", fontWeight: "300" }]}>
                                                    Started following <Text style={{ fontWeight: "400" }}>Luke Harper</Text>
                                                </Text>
                                            </View>
                                    </View>  */}
                                </View>
                            </View>
                        )
            )}
        </ScrollView>)}
        </View>
    )
}

export default RecentActivity
