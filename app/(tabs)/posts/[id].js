import { View,Text,StyleSheet,ActivityIndicator,Pressable,ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React,{ useEffect, useState, useCallback} from "react";
import { API_base } from "../../../service/API";

async function getJSON(URL) {
    const respuesta = await fetch(URL);
    if (!respuesta.ok) {
        let extra = '';
        try{
        extra = await respuesta.text();
        }catch{}
        throw new Error('Error al obtener la publicacion');
    }
    return respuesta.json();
}

export default function PostDetailScreen(){
    const {id} = useLocalSearchParams();
    const[loading,setLoading] = useState(false);
    const[error,setError] = useState(null);
    const[post, setPost] = useState(null);

    const cargarDetalle = useCallback(async () =>{
        if (!id) {
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const publicacion = await getJSON(`${API_base}/posts/${id}`);
            let nombreAutor = 'Autor desconocido';
            try {
                const usuario = await getJSON(`${API_base}/users/${publicacion.userId}`);
                nombreAutor = usuario?.name || nombreAutor;
            } catch {}
            setPost({...publicacion,nombreAutor});
        } catch (error) {
            setError(error?.message || 'No se pudo cargar la publicacion')
        }finally{
            setLoading(false);
        }
    }, [id]);

    useEffect(() =>{
        cargarDetalle();
    },[cargarDetalle]);
    if (loading) {
        return(
            <View style={styles.center}> <ActivityIndicator /> 
            <Text style={styles.info}> Cargando detalle ... </Text> </View>
        );
    }
    if (error) {
        return(
        <View style={styles.center}> <ActivityIndicator /> 
        <Text style={styles.error}> {error} </Text>
        <Pressable onPress={cargarDetalle} style={styles.button}> <Text style={styles.buttonText}> Reintentar </Text> </Pressable>
        </View>
        );
    }
    if (!post) {
        return(
            <View style={styles.center}> <ActivityIndicator /> 
            <Text style={styles.info}> No se encontro la publicacion </Text> </View>
        );
    }
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}> {post.title} </Text>
            <Text style={styles.autor}> Por {post.nombreAutor} </Text>
            <Text style={styles.body}> {post.body} </Text>

            <Pressable style={styles.button}> <Text style={styles.buttonText}> Agregar a favoritos </Text> </Pressable>
        </ScrollView>
    
    );

}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  listContainer: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 16, paddingBottom: 24 },

  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  info: { fontSize: 16, marginTop: 8 },
  small: { fontSize: 12, opacity: 0.7, marginTop: 4, textAlign: "center" },
  error: { color: "#b00020", textAlign: "center", paddingHorizontal: 16 },

  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    padding: 12,
    backgroundColor: "#fafafa",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardAuthor: { fontSize: 13, opacity: 0.8, marginBottom: 8 },
  cardBody: { fontSize: 14, lineHeight: 20 },
  more: {
    marginTop: 10,
    fontWeight: "600",
    textDecorationLine: "underline",

  },
  
    button: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#098df9",
  },
  buttonText: { color: "white", fontWeight: "600" },
  container:{
    padding:16,
    paddingBottom:32
  },
  autor:{
    fontSize:14,
    opacity:0.8,
    marginBottom:12
  },
  body: { fontSize: 16, lineHeight: 22 },
});