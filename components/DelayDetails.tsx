import { useEffect,useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { ScrollView } from "react-native";
import config from "./../config/config.json";
import { Base, Display, typography } from "../styles";
import station from "../models/station";
import getCoordinates from "../models/cordinates";
import Stations from "../interfaces/station";
import stationModel from "../models/station";
import { header2 } from "../styles/typography";


export default function DelayDetails({route}){
    const { delay, station } = route.params;
    const [marker, setMarker] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [curStn, setCurStn] = useState<Stations[]>([])
    const [desStn, setDesStn] = useState<Stations[]>([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [locationMarker, setLocationMarker] = useState(null);
    const [myLocation, setMyLocation] = useState([])

    useEffect(() => {
        (async () => {
            setCurStn(await stationModel.getStationByAcr(delay.FromLocation[0].LocationName))
            setDesStn(await stationModel.getStationByAcr(delay.ToLocation[0].LocationName))
            const results = await getCoordinates(curStn[0].Geometry.WGS84);
            setMarker(<Marker
                coordinate={{ latitude: parseFloat(results.lat), longitude: parseFloat(results.lon) }}
            />);
        })();
    }, [])

    useEffect(() => {
        (async () => {
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
            setLoading(false);
        })();
    }, [])
  
    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)

    return(
        <View style={Base.base}>
            <Text style={typography.centerBold}>{curStn[0].AdvertisedLocationName} - {desStn[0].AdvertisedLocationName}</Text>
            <Text style={typography.centerS}> Original Arrival: {new Date(delay.AdvertisedTimeAtLocation)
            .toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
            <Text style={typography.centerS}> Estimated Arrival: {new Date(delay.EstimatedTimeAtLocation)
            .toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
        <View style={styles.container}>
            <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude:myLocation.coords.latitude,
                        longitude:myLocation.coords.longitude,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.5
                    }}>
                {marker}
                {locationMarker}
            </MapView>
        </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: -1, 
        borderRadius: 10, 
        borderWidth: 1, 
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
