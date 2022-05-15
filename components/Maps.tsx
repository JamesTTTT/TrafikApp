import { View,StyleSheet,Text } from "react-native"
import { useEffect,useState } from "react";

import { Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import stationModel from "../models/station";
import delaysModel from "../models/delays";
import getCoordinates from "../models/cordinates";

import Delays from "../interfaces/delay";
import Stations from "../interfaces/station";

import { typography } from "../styles";

export default function DelayMap(){

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

    const trainMarkers = delayList
    .filter(delay => delay.hasOwnProperty("FromLocation"))
    .map( (item, index) => {
        let currentStation = stationList.filter(station => station.LocationSignature == item.FromLocation[0].LocationName)
        let stationLocation = getCoordinates(currentStation[0].Geometry.WGS84)
        return(
            <Marker
            key={index}
            coordinate={{
                latitude: parseFloat(stationLocation[0].lat),
                longitude: parseFloat(stationLocation[0].lon)
            }}
            title = {currentStation[0].AdvertisedLocationName}
            pinColor="blue"
            />
        )
    });

    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)
    
    return(
        <View style={styles.container}>
            <MapView style={styles.map}>
                {trainMarkers}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
