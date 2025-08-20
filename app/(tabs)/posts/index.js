import { View,Text,StyleSheet, ActivityIndicator, Pressable,FlatList, TextInput, Keyboard } from "react-native";
import { Link } from "expo-router";
import React,{ useEffect, useState, useCallback, useMemo} from "react";
import { fetchPosts, fetchUsers } from "../../../service/API";

export default function PostsScreen(){
    const[loading,setLoading] = useState(false);
    const[error,setError] = useState(null);
    const[posts, setPosts] = useState([]);
    const[refreshing, setRefreshing] = useState(false);
    const[query, setQuery] = useState('');

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
    const normalizedQuery = query.trim().toLowerCase();
    const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts; 
    return posts.filter((p) => {
      const title = String(p.title || "").toLowerCase();
      const body = String(p.body || "").toLowerCase();
      return title.includes(normalizedQuery) || body.includes(normalizedQuery);
    });
  }, [posts, normalizedQuery]);
    const preview = (text, max = 100) => typeof text === 'string' && text.length > max ? text.slice(0,max).trim() + '-' : text;
    const renderItem = ({item}) => (
        <View style={styles.card}> 
        <Text style={styles.cardTitle}> {item.title} </Text> 
        <Text style={styles.cardAuthor}> {item.autorName} </Text>
        <Text style={styles.cardBody}> {preview(item.body, 100)} </Text>
        <Link href={{pathname:'/posts/[id]', params:{id:String(item.id)}}} style={styles.more}> Ver mas</Link> 
        </View>
    );
  const ListHeader = (
    <View style={styles.searchBox}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por título o contenido…"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
        style={styles.input}
      />
      {query.length > 0 && (
        <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
          <Text style={styles.clearText}>Limpiar</Text>
        </Pressable>
      )}
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
    const sinResultado = !loading && posts.length > 0 && filteredPosts.length === 0;
    return(

        <View style={styles.listContainer}> 
        <FlatList
            data={filteredPosts}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View style={{height:12}} />}
            refreshing={refreshing}
            ListHeaderComponent={ListHeader}
            onRefresh={onRefresh}
            ListEmptyComponent={
                <View style={styles.center}>
                    {sinResultado? (<Text>
                        No se encontraron resultados para '{query}'
                    </Text>) : (<Text style={styles.info}>No hay publicaciones para mostrar</Text>)}
                </View>
            }
        />
        </View>

    );

}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  listContainer: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 16, paddingBottom: 24 },
  
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
  more: { marginTop: 10, fontWeight: "600", textDecorationLine: "underline" },
  
  searchBox: {
    marginBottom: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  clearBtn: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  clearText: { fontWeight: "600" },
  
  info: { fontSize: 16, marginTop: 8, textAlign: "center" },
  small: { fontSize: 12, opacity: 0.7, marginTop: 4, textAlign: "center" },
  error: { color: "#b00020", textAlign: "center", paddingHorizontal: 16 },
});