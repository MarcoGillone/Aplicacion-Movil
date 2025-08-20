import AsyncStorage from "@react-native-async-storage/async-storage";
const storageKey = "@favorites_post";
async function leerCrudo() {
    try {
        const Json = await AsyncStorage.getItem(storageKey);
        if (!Json) {
            return [];
            
        }
        const parseado = JSON.parse(Json);
        return Array.isArray(parseado)? parseado: [];
    } catch (error) {
        console.warn('Error al obtener un item',error);
        return [];
    }
}
async function escribirCrudo(List) {
    try {
        const listaSegura = Array.isArray(List)? List: [];
        await AsyncStorage.setItem(storageKey, JSON.stringify(listaSegura));
    } catch (error) {
        console.warn('Error al obtener un item',error);
    }
}

function normalizarFavorito(favorito) {
    if (!favorito) {
        return null;
    }
    const id = favorito.id != null ? favorito.id: favorito.postId;
    if (id == null) {
        return null;
    }
    return {
        id,
        title: String(favorito.title),
        autorName: String(favorito.autorName)
    };

}
function compararId(publicacion, id2){
        return String(publicacion.id) === String(id2);
}
export async function getFavorites() {
    return leerCrudo();
}

export async function esFavorita(id) {
    const lista = await leerCrudo();
    return lista.some((p) => compararId(p, id));
}
export async function agregarFavorito(favorito) {
    const publicacionNormalizada = normalizarFavorito(favorito);
    if (!publicacionNormalizada) {
        return leerCrudo();
    }
    const lista = await leerCrudo();
    const existe = lista.some((p) => compararId(p, publicacionNormalizada.id));
    if (existe) {
        return lista;
    }
    const actualizada = [...lista, publicacionNormalizada];
    await escribirCrudo(actualizada);
    return actualizada;
}
export async function eliminarFavoritos(id) {
    const lista = await leerCrudo();
    const actualizada = lista.filter((p) => !compararId(p,id));
    await escribirCrudo(actualizada);
    return actualizada;
}

export async function alternar(favorito) {
        const publicacionNormalizada = normalizarFavorito(favorito);
    if (!publicacionNormalizada) {
        return leerCrudo();
    }
    const lista = await leerCrudo();
    const existe = lista.some((p) => compararId(p, publicacionNormalizada.id));
    if (existe) {
        const actualizada = lista.filter((p) => !compararId(p,publicacionNormalizada.id));
        await escribirCrudo(actualizada);
        return false;
    }else{
        const actualizada = [...lista, publicacionNormalizada];
        await escribirCrudo(actualizada);
        return true;
    }
}