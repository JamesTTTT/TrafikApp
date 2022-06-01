import { useState, useEffect } from "react";
import { View,Text, ScrollView} from "react-native";
import { Display, typography } from "../../styles";
import Stations from "../../interfaces/station";
import delaysModel from "../../models/delays";
import stationModel from "../../models/station";
import Delays from "../../interfaces/delay";

export default function StationDelay({route, navigation}){
    const { station } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [stationDetails, setStationDetails] = useState<Stations>({})
    const [stationList, setStations] = useState<Stations[]>([]);
    const [stationDelays, setDelays] = useState<Delays[]>([])

    useEffect(()=>{
        (async ()=>{
            setStationDetails(await stationModel.getStationByName(station.artefact))
            setStations(await stationModel.getStations());
            setDelays(await delaysModel.getDelays())
            setLoading(false);
        })();
    },[])


    const delaysForStation = stationDelays
    .filter(delay => delay.hasOwnProperty("FromLocation"))
    .filter(delay => delay.FromLocation[0].LocationName == stationDetails.LocationSignature)
    .map((item,index)=>{
        let Est = new Date(item.EstimatedTimeAtLocation)
        let Adv = new Date(item.AdvertisedTimeAtLocation)
        let nameOfDestination = stationList.filter(station => station.LocationSignature == item.ToLocation[0].LocationName)
        let diff = delaysModel.timeDifference(Est,Adv) ;
        return<View 
            key={index}
            style={Display.box}>
                <Text style={typography.stationName}>To: {nameOfDestination[0].AdvertisedLocationName}</Text>
                <Text style={typography.newTime}>{Est.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
                <Text style={typography.oldTime}>{Adv.toLocaleString("se-SV",{hour: '2-digit', minute:'2-digit'})}</Text>
                <View style={Display.delayTimebox}>
                <Text style={typography.delayTime}>{diff} minutes</Text>
            </View>
            </View>
    })

    const checkStationList = ()=>{
        if (delaysForStation.length<1){
            return(<Text style={typography.normal}>There is currently no delays for this stations</Text>)
        }
        else {
            return delaysForStation
        }
    }

    if(isLoading) return (<View>
        <Text style={typography.center}>Loading...</Text>
    </View>
    )
    return(
        <ScrollView>
            <Text style={typography.center}>Delays From {stationDetails.AdvertisedLocationName}</Text>
            {checkStationList()}
        </ScrollView>
    )
}