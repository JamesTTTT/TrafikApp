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
    // const [trainMarker, setTrainMarkers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [locationMarker, setLocationMarker] = useState(null);
    const [myLocation, setMyLocation] = useState([])

    useEffect(()=>{
        (async()=>{
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMessage("Permission to access location was denied");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setMyLocation(currentLocation);
            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}
                title="Min Plats"
                pinColor="blue"
                />);
            setStations(await stationModel.getStations());
            setDelayList(await delaysModel.getDelays());
            setLoading(false)
        })();

    }, []);

    const trainMarkers = delayList
    .filter(delay => delay.hasOwnProperty("FromLocation"))
    .map( (item, index) => {
        let currentStation = stationList.filter(station => station.LocationSignature == item.FromLocation[0].LocationName)
        let stationLocation = getCoordinates(currentStation[0].Geometry.WGS84);
        let Est = new Date(item.EstimatedTimeAtLocation)
        let Adv = new Date(item.AdvertisedTimeAtLocation)
        let diff = delaysModel.timeDifference(Est,Adv) ;
        return(
            <Marker
            coordinate={{
                latitude: parseFloat(stationLocation.lat),
                longitude: parseFloat(stationLocation.lon)
            }}
            description={`Delay: ${diff} Minutes`}
            title = {currentStation[0].AdvertisedLocationName}
            pinColor="red"
            key={index}
            />
        );
    });

    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)
    
    return(
        <View style={styles.container}>
            <MapView style={styles.map}>
                {locationMarker}
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
