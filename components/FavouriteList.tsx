import { View , ScrollView, Text} from "react-native"
import { useEffect, useState } from "react"
import { Display,typography } from "../styles";
import favModel from "../models/favourite";

export default function FavouriteList({ route, navigation}) {

    const [likedStations, setLikedStations] = useState([])


    useEffect(()=>{
        (async()=>{
            setLikedStations(await favModel.getLiked());

        })();
      }, []);


      const StationList = likedStations.map((item, index) =>{
          return(
            <View key={index}
            style={Display.box}>
                <Text style={typography.stationName}>{item.artefact}</Text>
            </View>
          )

      })

    return(
        <ScrollView>
            {StationList}
        </ScrollView>
    )
}