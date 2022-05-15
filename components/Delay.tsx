import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DelayListPage from './DelaysList';
import DelayDetails from './DelayDetails';

const Stack = createNativeStackNavigator();

export default function Delay() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="List" component={DelayListPage}/>
            <Stack.Screen name="Details" component={DelayDetails}/>
        </Stack.Navigator>
    )
}