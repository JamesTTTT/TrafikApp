import { View , ScrollView, Text, Button, Pressable,TouchableOpacity} from "react-native"
import { useEffect, useState } from "react"
import { Display,typography, Buttons } from "../../styles";
import favModel from "../../models/favourite";
import stationModel from "../../models/station";
import { Ionicons } from '@expo/vector-icons';

export default function FavouriteList({ route, navigation}) {

    const [likedStations, setLikedStations] = useState([])


    useEffect(()=>{
        (async()=>{
            setLikedStations(await favModel.getLiked());
        })();
      }, []);


      const StationList = likedStations.map((item, index) =>{
          return(
            <TouchableOpacity key={index}
            style={Display.box}
            onPress={()=>{
                navigation.navigate('Details', {
                    station: item,
                });
            }}>
                <View style={Display.spacebox}>
                <Text style={typography.stationName}>{item.artefact}</Text>
                <Ionicons name={"arrow-redo-sharp"} size={35}/>
                </View>
            </TouchableOpacity>
          )

      })

      const checkStationList = ()=>{
          if (StationList.length<1){
              return(<Text style={typography.centerXL}>Your Favourites is empty!</Text>)
          }
          else {
              return StationList
          }
      }

    return(
        <ScrollView>
            <Text style={typography.label}>View delays for:</Text>
            {checkStationList()}
        </ScrollView>
    )
}