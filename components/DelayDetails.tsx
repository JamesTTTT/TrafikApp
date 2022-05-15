import { useEffect,useState } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { ScrollView } from "react-native";
import config from "./../config/config.json";
import { Base, Display, typography } from "../styles";
import station from "../models/station";
import getCoordinates from "../models/cordinates";
import { StyleSheet } from "react-native";
import Stations from "../interfaces/station";
import stationModel from "../models/station";


export default function DelayDetails({route}){
    const { delay, station } = route.params;
    const [marker, setMarker] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [curStn, setCurStn] = useState<Stations>([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [locationMarker, setLocationMarker] = useState(null);
    const [myLocation, setMyLocation] = useState([])
    useEffect(() => {
        (async () => {
            const results = await getCoordinates(`${curStn[0].AdvertisedLocationName}`);
            setMarker(<Marker
                coordinate={{ latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }}
                title={results[0].display_name}
            />);
        })();
    }, []);

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
            setCurStn(await stationModel.getStationByAcr(delay.FromLocation[0].LocationName))
            setLoading(false)

        })();
    }, [])
  
    if (isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>)

    return(
        <View style={Base.base}>
            <Text>Station: {curStn[0].AdvertisedLocationName}</Text>
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
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
