import { View,Text,StyleSheet } from "react-native";

export default function FavoritesScreen(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Favoritos</Text>
            <Text>Aca apareceran los Favoritos</Text>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {flex:1, alignItems: 'center', justifyContent: 'center', padding: 16},
    title: {fontSize:20, fontWeight:'600', marginBottom:8}
});