import { useEffect,useState } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput,ScrollView,Keyboard } from "react-native";
import config from "../config/config.json";
import { Base, Display, Input } from "../styles";
import { input } from "../styles/input";

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

    // useEffect(()=>{
    //     fetch(`${config.base_url}/delayed`)
    //     .then(response => response.json())
    //     .then(result => setDelayList(result.data));
    //     fetch(`${config.base_url}/stations`)
    //     .then(response => response.json())
    //     .then(result => setStations(result.data))
    //     setLoading(false)
    // }, []);

    useEffect(async ()=>{
        setStations(await stationModel.getStations());
        setDelayList(await delaysModel.getDelays());
        setLoading(false)
    }, []);

    const listOfDelays = delayList
    .filter(delay => delay.hasOwnProperty("FromLocation"))
    .map((item, index) => {
        let nameOfStation = stationList.filter(station => station.LocationSignature == item.FromLocation[0].LocationName)
        return <Text
                key={index}
                style={Display.box}
                onPress={() => {
                    navigation.navigate('Delay', {
                        delay: item
                    });
                }}>
                     
            Station: {nameOfStation[0].AdvertisedLocationName}{"\n"}
            Activity Type: {item.ActivityType}{"\n"}
            Estimated Arrival: {item.EstimatedTimeAtLocation.toLocaleString("se-SV")}{"\n"}

        </Text>
    });

    if (isLoading) return (<View>
        <Text>Loading...</Text>
    </View>)

    return (
        <View>
            {/* <SearchBar
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              clicked={clicked}
              setClicked={setClicked}
            /> */}
            <ScrollView>
            <Text>Current Delays</Text>
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
