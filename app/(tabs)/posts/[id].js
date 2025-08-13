import { View,Text,StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function PostDetailScreen(){
    const {id} = useLocalSearchParams();

    return(
    
        <View style={styles.container}> 
        <Text style={styles.title}> Detalle de la publicacion </Text>
        <Text> id:{String(id ?? '')} </Text>
        <Text> aca va titulo y detallede la publicacion</Text>
        </View>
    
    );

}

const styles = StyleSheet.create({
    container: {flex:1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {fontSize:20, fontWeight:'600', marginBottom:8}
});