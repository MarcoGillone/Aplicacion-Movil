import { View,Text,StyleSheet } from "react-native";

export default function PostsScreen(){
    return(

        <View style={styles.container}> 
        <Text style={styles.title}> Publicaciones </Text>
        <Text> Aca va la busqueda y la lista </Text>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {flex:1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {fontSize:20, fontWeight:'600', marginBottom:8}
});