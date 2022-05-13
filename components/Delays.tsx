import { useEffect,useState } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import config from "./../config/config.json";
import { Base, Display } from "../styles";
import stationModel from "../models/station";


export default function DelayList() {

    const [delayList, setDelayList] = useState([]);
    const [stationList, setStations] = useState([]);

    useEffect(()=>{
        fetch(`${config.base_url}/delayed`)
        .then(response => response.json())
        .then(result => setDelayList(result.data));
        fetch(`${config.base_url}/stations`)
        .then(response => response.json())
        .then(result => setStations(result.data));
        console.log(stationList)
    }, []);

    const listOfDealys = delayList.map((item, index) =>{
        let nameOfStation = stationList.filter(
            station => station.LocationSignature === item.FromLocation[0].LocationName)
        return <Text key={index} style={Display.box}>
            Station: {nameOfStation[0].AdvertisedLocationName}{"\n"}
            Activity Type: {item.ActivityType}{"\n"}
            Estimated Arrival: {item.EstimatedTimeAtLocation.toLocaleString("se-SV")}{"\n"}

        </Text>
    });

    return (
        <SafeAreaView style={Base.container}> 
        <View>
            <ScrollView>
            <Text>Current Delays</Text>
            {listOfDealys}
            </ScrollView>
        </View>
        </SafeAreaView>
    );
}