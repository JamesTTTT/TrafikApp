import { View, Text, TextInput, Button } from "react-native";
import { showMessage } from "react-native-flash-message";
import { typography, Forms, Base } from '../../styles';

export default function AuthFields({ auth, setAuth, title, submit, navigation}) {

    function validatePassword(text: string){
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\.-]).{4,}$/

        if (!text.match(pattern)) {
            showMessage({
                message: "Icke gilitigt lösenord",
                description:"Lösenordet måste innehålla minst 4 tecken, små och stora bokstäver, siffror och ett speciellt täcken",
                type: "warning",
            });
        }
    }

    function validateEmail(text: string){
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!text.match(pattern)) {
            showMessage({
                message: "Icke gilitig Email",
                description:"Du måste ange en giltig email tex sssss@ssss.sss",
                type: "warning",
            });
        }
    }

    return (
        <View style={Base.base}>
            <Text style={typography.header2}>{title}</Text>
            <Text style={typography.label}>E-post</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    validateEmail(content)
                    setAuth({ ...auth, email: content })
                }}
                value={auth?.email}
                keyboardType="email-address"
            />
            <Text style={typography.label}>Lösenord</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    validatePassword(content)
                    setAuth({ ...auth, password: content })
                }}
                value={auth?.password}
                secureTextEntry={true}
            />
            <Button
                title={title}
                onPress={() => {
                    submit();
                }}
            />
            {title === "Logga in" &&
                <Button
                    title="Registrera istället"
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                />
            }
        </View>
    );
};