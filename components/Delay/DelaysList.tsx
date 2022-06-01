import { useCallback,useEffect,useState } from "react";
import { RefreshControl, View, Text, Button,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput,ScrollView,Keyboard } from "react-native";

import { Base, Display, Input, typography } from "../../styles";

import stationModel from "../../models/station";
import delaysModel from "../../models/delays";

import Delays from "../../interfaces/delay";
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

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function DelayList({navigation, route, searchPhrase }) {
    
    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      setStations(await stationModel.getStations());
      setDelayList(await delaysModel.getDelays());
      wait(2000).then(() => setRefreshing(false));
    }, []);

    const [refreshing, setRefreshing] = useState(false);
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
        let diff = delaysModel.timeDifference(Est,Adv) ;
        
        let nameOfStation = stationList.filter(station => station.LocationSignature == item.FromLocation[0].LocationName)
        let nameOfDestination = stationList.filter(station => station.LocationSignature == item.ToLocation[0].LocationName)
        return <TouchableOpacity
                key={index}
                style={Display.box}
                onPress={() => {
                    navigation.navigate('Details', {
                        delay: item,
                    });
                }}>
                     
            <Text style={typography.stationName}>{nameOfStation[0].AdvertisedLocationName} - {nameOfDestination[0].AdvertisedLocationName}</Text>
            <Text style={typography.newTime}>{Est.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
            <Text style={typography.oldTime}>{Adv.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
            <View style={Display.delayTimebox}>
                <Text style={typography.delayTime}>{diff} minutes</Text>
            </View>

            </TouchableOpacity>
    });

    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }>
        <Text style={typography.label}>Current Delays</Text>
        {listOfDelays}
        </ScrollView>
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

