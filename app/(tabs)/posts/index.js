import { View,Text,StyleSheet, ActivityIndicator, Pressable,FlatList } from "react-native";
import { Link } from "expo-router";
import React,{ useEffect, useState, useCallback} from "react";
import { fetchPosts, fetchUsers } from "../../../service/API";

export default function PostsScreen(){
    const[loading,setLoading] = useState(false);
    const[error,setError] = useState(null);
    const[posts, setPosts] = useState([]);
    const[refreshing, setRefreshing] = useState(false);

    const cargarPost = useCallback(async () => {
        setError(null);
        setLoading(true);
        try{
            const [postsData, usersData] = await Promise.all([fetchPosts(),fetchUsers()]);
            const usersById = {};
            for(const u of usersData){
                usersById[u.id] = u.name;
            }
            const postCompleto = postsData.map((p)=>({
                ...p,
                autorName: usersById[p.userId]||'autor desconocido'
            }));
            setPosts(postCompleto);
            console.log('Post recibidos: ',postsData.length);

        }catch(e){
            setError(e?.message|| 'no se pudieron cargar las publicaciones')
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(() => {cargarPost();},[cargarPost]);
    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        try{
            await cargarPost();
        }finally{
            setRefreshing(false);

        }
    }, [cargarPost]);
    const preview = (text, max = 100) => typeof text === 'string' && text.length > max ? text.slice(0,max).trim() + '-' : text;
    const renderItem = ({item}) => (
        <View style={styles.card}> 
        <Text style={styles.cardTitle}> {item.title} </Text> 
        <Text style={styles.cardAuthor}> {item.autorName} </Text>
        <Text style={styles.cardBody}> {preview(item.body, 100)} </Text>
        <Link href={{pathname:'/posts/[id]', params:{id:String(item.id)}}} style={styles.more}> Ver mas</Link> 
        </View>
    );
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

        <View style={styles.listContainer}> 
        <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{height:12}}/>}
        refreshing = {refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.info}>No hay publicaciones para mostrar</Text>
            </View>
        }
        ></FlatList>
        </View>

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
});