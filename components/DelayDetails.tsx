import { useEffect,useState } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { ScrollView } from "react-native";
import config from "./../config/config.json";
import { Base, Display } from "../styles";
import station from "../models/station";


export default function DelayDetails({route}){
    const { delay } = route.params;
    const [marker, setMarker] = useState(null);
    const [locationMarker, setLocationMarker] = useState(null);

    return(
        <SafeAreaView>
        <View>
            <Text>
                {delay.LocationSignature}
            </Text>
        </View>
        </SafeAreaView>
    );
}
