import { View,Text,StyleSheet } from "react-native";

export default function SettingsScreen(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Configuarcion</Text>
            <Text>Ajustes basicos</Text>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {flex:1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {fontSize:20, fontWeight:'600', marginBottom:8}
});