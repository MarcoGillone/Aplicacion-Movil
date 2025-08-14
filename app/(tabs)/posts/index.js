import { View,Text,StyleSheet, ActivityIndicator, Pressable } from "react-native";
import React,{ useEffect, useState, useCallback} from "react";
import { fetchPosts } from "../../../service/API";

export default function PostsScreen(){
    const[loading,setLoading] = useState(false);
    const[error,setError] = useState(null);
    const[posts, setPosts] = useState([]);

    const cargarPost = useCallback(async () => {
        setError(null);
        setLoading(true);
        try{
            const data = await fetchPosts();
            setPosts(data);
            console.log('Post recibidos: ',data.length);

        }catch(e){
            setError(e?.message|| 'no se pudieron cargar las publicaciones')
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(() => {cargarPost();},[cargarPost]);
    
    if (loading) {
        return(<View style={styles.center}> <ActivityIndicator/> <Text style={styles.info}> Cargando... </Text> </View>);
    }
    if (error) {
        return(<View style={styles.center}> 
        <Text style={styles.error}> {error} </Text>
        <Pressable onPress={cargarPost} style={styles.button}>
            <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
        </View>);
    }

    return(

        <View style={styles.center}> 
        <Text style={styles.title}> Publicaciones </Text>
        <Text style={styles.info}> Recibidos {posts.length} posts </Text>
        <Text style = {styles.small}>Lista</Text>
        </View>

    );

}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  info: { fontSize: 16, marginTop: 8 },
  small: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  error: { color: "#b00020", textAlign: "center", paddingHorizontal: 16 },
  button: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#098df9",
  },
  buttonText: { color: "white", fontWeight: "600" },
});