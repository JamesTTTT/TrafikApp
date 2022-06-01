import { View, ScrollView, Text,TouchableOpacity,Button, Pressable } from "react-native";
import { useState, useEffect, useReducer } from "react";
import stationModel from "../../models/station";
import favModel from "../../models/favourite";
import storage from "../../models/storage";
import { Buttons, Display,typography } from "../../styles";
import { Ionicons } from '@expo/vector-icons';
import { button } from "../../styles/buttons";

export default function StationList({ route, navigation, setIsLoggedIn }) {
  const [stationList, setStations] = useState<Stations[]>([]);
  const [likedStations, setLikedStations] = useState([]);
  const [ignored, forceUpdate] = useReducer(x=> x+1,0);
  const { reload } = route.params || true;

  if(reload) {
    setFavourites();
    route.params = false;
}

  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function logOut() {
    storage.deleteToken();
    setIsLoggedIn(false);
  }

  async function setFavourites() {
    const favArr = await favModel.getLiked();
    const favNames = favArr.map((object: object)=> object.artefact)
    setLikedStations(favNames)
  }

  useEffect(()=>{
    (async()=>{
        setStations(await stationModel.getStations());
        setFavourites()
        navigation.addListener('focus', ()=>setFavourites());
    })();
  }, []);

  const checkStation = (curStation:string)=>{
   for(let station of likedStations){
     if(station == curStation){
       return true
     }
   }
   return false;
   }

  const addFavourite = async(stationName:string)=>{
    await favModel.createLikedStation(stationName);
  }

  const deleteFavourite = async (stationId: number) => {
    await favModel.deleteLiked(stationId)
  }

  const getId =async (name: string) => {
    const favArr = await favModel.getLiked();
    const favObj = favArr.filter((object: object)=> {return object.artefact === name})
    return favObj[0].id
  }

  const toggleStations = async(name:string)=>{
    if(checkStation(name)){
      const id = await getId(name);
      deleteFavourite(id)
      console.log("Deleted")
    } else {
      addFavourite(name)
      console.log("Added")
    }
  }

  const listOfStations = stationList.map((item, index) => {
  return (

    <TouchableOpacity
    key={index}
    style={Display.box}
    onPress={async () => {
      toggleStations(item.AdvertisedLocationName);
      await sleep(1000);
      setFavourites();
    }}>
      <View style={Display.spacebox}>
      <Text style={typography.stationName}>{item.AdvertisedLocationName}</Text>
      {checkStation(item.AdvertisedLocationName) ?
        <Ionicons name={"heart"} size={30} color={"red"} /> :
        <Ionicons name={"heart-outline"} size={30} color={"black"} />

      }
      </View>
    </TouchableOpacity>)
  })


  return (

    <ScrollView>
      <View style={Display.spacebox2}>
      <Pressable 
      style={Buttons.button} 
      onPress={()=> navigation.navigate('Favourites')}>
        <Text style={Buttons.buttonText}>View Favourites</Text>
      </Pressable>
      <Pressable
        style={Buttons.button}
        onPress={async ()=> {
            await logOut()
            navigation.navigate('Login')
        }}
        >
        <Text style={Buttons.buttonText}>Logout</Text>
      </Pressable>
      </View>
      <Text style={typography.label}>All Stations:</Text>
      {listOfStations}
    </ScrollView>
  )
}
