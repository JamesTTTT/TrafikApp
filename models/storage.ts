import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
    storeToken: async function storageToken(token:string) {
        try {
            const tokenAndate = {
                token: token,
                date: new Date().getTime()
            };
            const jsonValue = JSON.stringify(tokenAndate);
            await AsyncStorage.setItem('@token', jsonValue);
        } catch (e) {
            //error
        }
    },
    readToken: async function readToken(): Promise<any> {
        try {
            const jsonValue = await AsyncStorage.getItem("@token");
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e){
            //error
        }
    },
    deleteToken: async function deleteToken() {
        await AsyncStorage.removeItem('@token');
    }
};

export default storage;