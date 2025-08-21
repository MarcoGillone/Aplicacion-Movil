import { View,Text,StyleSheet, FlatList, ActivityIndicator, Alertn, Pressable, Alert } from "react-native";
import React,{ useEffect, useState, useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { getFavorites, eliminarFavoritos } from "../../../storage/favoritesStorage";
import {Ionicons} from '@expo/vector-icons';

export default function FavoritesScreen(){
        const[loading,setLoading] = useState(false);
        const[error,setError] = useState(null);
        const[favoritos, setFavoritos] = useState([]);
        const[refreshing, setRefreshing] = useState(false);
        
        const cargarFavoritos = useCallback(async () => {
            setError(null);
            setLoading(true);
            try {
                const listaFavoritos = await getFavorites();
                setFavoritos(listaFavoritos);
            } catch (error) {
                setError('No se pudieron cargar los favoritos', error);
            }finally{
                setLoading(false);
            }

        },[]);

        useFocusEffect(useCallback(()=>{cargarFavoritos();},[cargarFavoritos]));
        const onRefresh = useCallback(async ()=>{
            setRefreshing(true);
            try{
                await getFavorites();
            }finally{
                setRefreshing(false);
            }
        },[cargarFavoritos]);

        const onRemuve = useCallback(async (id)=>{
            try {
                await eliminarFavoritos(id);
                setFavoritos((p)=>p.filter((f)=>{
                    String(f.id) !== String(id);
                }));
                Alert.alert('Favoritos', 'Se elimino correctamente');
            } catch (error) {
                Alert.alert('Error', 'No se pudo eliminar');
            }
        },[]);

        
        const renderItem = ({item})=>(
            

            <View style={styles.card}>
                <View style={{flex:1}}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.title}

                    </Text>
                    {!!item.autorName && (<Text>Por {item.autorName}</Text>)}
                    <Link href={{pathname:'/posts/[id]', params:{id:String(item.id), 
                        autorName:item.autorName}}} style={styles.more}>
                    Ver detalle</Link>
                </View>
                <Pressable onPress={()=>{onRemuve(item.id)}} style={styles.trashBtn} hitSlop={10}>
                        <Ionicons name="trash-outline" size={22} color={'rgba(149, 4, 4, 0.81)'}/>
                </Pressable>
            </View>
        );

    if (loading) {
        return(
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={styles.info}> Cargando favoritos... </Text>
            </View>
        );
    }

    if (error) {
        return(
            <View style={styles.center}>
                <Text>{error}</Text>
                <Text>Desliza haci abajo para recargar</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <FlatList 
            data={favoritos}
            keyExtractor={(item)=>{String(item.id)}}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View style={{height:12}} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
                <View style={styles.center}>
                    <Text style={styles.info}>No hay favoritos guardados</Text>
                    <Text style={styles.small}>Elige una publicacion y preciona agregar a favoritos</Text>
                </View>
            }
            />

        </View>
    );

}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 16, paddingBottom: 24 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  info: { fontSize: 16, marginTop: 8, textAlign: "center" },
  small: { fontSize: 12, opacity: 0.7, marginTop: 4, textAlign: "center" },
  error: { color: "#b00020", textAlign: "center", paddingHorizontal: 16 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    padding: 12,
    backgroundColor: "#fafafa",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardAuthor: { fontSize: 13, opacity: 0.8, marginBottom: 8 },
  more: { marginTop: 2, fontWeight: "600", textDecorationLine: "underline" },

  trashBtn: {
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});