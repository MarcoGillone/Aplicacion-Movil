import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { API_base } from "../../../service/API";
import { esFavorita, alternar } from "../../../storage/favoritesStorage";

async function getJSON(URL) {
  const respuesta = await fetch(URL);
  if (!respuesta.ok) {
    let extra = "";
    try {
      extra = await respuesta.text();
    } catch {}
    throw new Error("Error al obtener la publicacion");
  }
  return respuesta.json();
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [favorito, setFavorito] = useState(false); 

  const cargarDetalle = useCallback(async () => {
    if (!id) return;
    setError(null);
    setLoading(true);

    try {
      const publicacion = await getJSON(`${API_base}/posts/${id}`);
      let nombreAutor = "Autor desconocido";
      try {
        const usuario = await getJSON(`${API_base}/users/${publicacion.userId}`);
        nombreAutor = usuario?.name || nombreAutor;
      } catch {}

      const postCompleto = { ...publicacion, nombreAutor };
      setPost(postCompleto);

      
      const yaFav = await esFavorita(postCompleto.id);
      setFavorito(yaFav);
    } catch (error) {
      setError(error?.message || "No se pudo cargar la publicacion");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

 
  const manejarFavorito = async () => {
    if (!post) return;
    const nuevoEstado = await alternar(post);
    setFavorito(nuevoEstado);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.info}> Cargando detalle ... </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={cargarDetalle} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}> No se encontro la publicacion </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.autor}>Por {post.nombreAutor}</Text>
      <Text style={styles.body}>{post.body}</Text>

      
      <Pressable style={styles.button} onPress={manejarFavorito}>
        <Text style={styles.buttonText}>
          {favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  autor: { fontSize: 14, opacity: 0.8, marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 22 },
  info: { fontSize: 16, marginTop: 8 },
  error: { color: "#b00020", textAlign: "center", paddingHorizontal: 16 },
    button: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#098df9",
    alignSelf: "flex-start", 
    minWidth: 140,           
  },
  buttonText: { 
    color: "white", 
    fontWeight: "600", 
    textAlign: "center" 
  },

});
