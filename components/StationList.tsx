import { View, ScrollView, Text,TouchableOpacity,Button } from "react-native";
import { useState, useEffect } from "react";
import stationModel from "../models/station";
import favModel from "../models/favourite";
import storage from "../models/storage";
import { Display,typography } from "../styles";
import { Ionicons } from '@expo/vector-icons';

export default function StationList({ route, navigation, setIsLoggedIn }) {
  const [stationList, setStations] = useState<Stations[]>([]);
  const [likedStations, setLikedStations] = useState([])
  //const [isLiked, setLiked] = useState(false);

  async function logOut() {
    storage.deleteToken();
    setIsLoggedIn(false);
  }

  useEffect(()=>{
    (async()=>{
        setStations(await stationModel.getStations());
        //await getFavs();
    })();
  }, []);

  const checkStation = (curStation:string)=>{
    for(let station of likedStations){
      if(station === curStation){
        return true
      }
    }
    return false
  }

  const addFavourite = async(stationName:string)=>{
    await favModel.createLikedStation(stationName);
    console.log("added")
  }

  // const getFavs = async() =>{
  //   const likedArr = await favModel.getLiked()
  //   for(let i = 0; i<likedArr.lenght;i++){
  //     setLikedStations((likedStations) => [...likedStations, likedArr[i]])

  //   }
  // }

  // const toggleStations = async(curStation:object)=>{
  //   if(checkStation(curStation)){
  //     // setLikedStations(likedStations.filter((station)=>{
  //     //   return station !== curStation
  //     // }))
  //     console.log("here")
  //   } else {
      
  //     console.log("nothing")
  //     // setLikedStations((likedStations) => [...likedStations, curStation])
  //   }
  // }

  const listOfStations = stationList.map((item, index) => {
  return (

    <TouchableOpacity
    key={index}
    style={Display.box}
    onPress={() => {
      addFavourite(item.AdvertisedLocationName)
    }}>
      <Text style={typography.stationName}>{item.AdvertisedLocationName}</Text>
      {checkStation(item.AdvertisedLocationName) ?
        <Ionicons name={"heart"} size={30} color={"red"} /> :
        <Ionicons name={"heart-outline"} size={30} color={"black"} />

      }
    </TouchableOpacity>)
  })


  return (

    <ScrollView>
      <Button title="View Favourites"
        onPress={()=> navigation.navigate('Favourites')}/>
      <Button
            title ="Logga ut"
            onPress={async ()=> {
                await logOut()
            }}
            />
      {listOfStations}
    </ScrollView>
  )
}
