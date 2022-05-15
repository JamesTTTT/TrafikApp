import { useEffect,useState } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput,ScrollView,Keyboard } from "react-native";
import config from "../config/config.json";

import { Base, Display, Input, typography } from "../styles";
import { header1 } from "../styles/typography";

import stationModel from "../models/station";
import delaysModel from "../models/delays";

import Delays from "../interfaces/delay";
import Stations from "../interfaces/station";

function SearchBar({clicked, searchPhrase, setSearchPhrase, setClicked}) {
    return(
        <View style={Input.inputContainer}>
            <TextInput
                placeholder="Search"
                value={searchPhrase}
                onChange={setSearchPhrase}
                onFocus={()=> {
                    setClicked(true);
                }}
                style={Input.input}
            />
        {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}>
          </Button>
        </View>
      )}
        </View>

    )
}

function DelayList({navigation, route, searchPhrase }) {

    const [delayList, setDelayList] = useState<Delays[]>([]);
    const [stationList, setStations] = useState<Stations[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            setStations(await stationModel.getStations());
            setDelayList(await delaysModel.getDelays());
            setLoading(false)
        })();
    }, []);

    const listOfDelays = delayList
    .filter(delay => delay.hasOwnProperty("FromLocation"))
    .map((item, index) => {
        let Est = new Date(item.EstimatedTimeAtLocation)
        let Adv = new Date(item.AdvertisedTimeAtLocation)
        let diff = diff_minutes(Est,Adv) ;
        
        let nameOfStation = stationList.filter(station => station.LocationSignature == item.FromLocation[0].LocationName)
        let nameOfDestination = stationList.filter(station => station.LocationSignature == item.ToLocation[0].LocationName)
        return <Text
                key={index}
                style={Display.box}
                onPress={() => {
                    navigation.navigate('Details', {
                        delay: item,
                    });
                }}>
                     
            Station: {nameOfStation[0].AdvertisedLocationName}{"\n"}
            Destination: {nameOfDestination[0].AdvertisedLocationName}{"\n"}
            Original Arrival: {Adv.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}{"\n"}
            Estimated Arrival: {Est.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}{"\n"}
            Current Delay: {diff} minutes

        </Text>
    });

    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)

    return (
        <View>
            <ScrollView>
            <Text style={typography.center}>Current Delays</Text>
            {listOfDelays}
            </ScrollView>
        </View>
    );
}

export default function DelayListPage({navigation}) {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);

    return (
        <SafeAreaView style={Base.container}>
        <View>
            <SearchBar
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              clicked={clicked}
              setClicked={setClicked}
            />
        <DelayList navigation={navigation} searchPhrase={searchPhrase}/>
        </View>
        </SafeAreaView>
    )
}

function diff_minutes(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }
