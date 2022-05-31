import { View } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StationList from "./StationList";
import FavouriteList from "./FavouriteList";

const Stack = createNativeStackNavigator();

export default function Favourite(props) {
  return (
    <Stack.Navigator initialRouteName="List">
    <Stack.Screen name="List">
        {(screenProps) => <StationList { ...screenProps} 
        setIsLoggedIn = {props.setIsLOggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Favourites">
    {(screenProps) =><FavouriteList { ...screenProps}/>}
    </Stack.Screen>
    </Stack.Navigator>
  )
}
