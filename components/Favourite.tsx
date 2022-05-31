import { View } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavouriteList from "./FavouriteList";

const Stack = createNativeStackNavigator();

export default function Favourite(props) {
  return (
    <Stack.Navigator initialRouteName="List">
    <Stack.Screen name="List">
        {(screenProps) => <FavouriteList { ...screenProps} 
        setIsLoggedIn = {props.setIsLOggedIn} />}
    </Stack.Screen>
    {/* <Stack.Screen name="Form" component={InvoiceForm}/> */}
    </Stack.Navigator>
  )
}
