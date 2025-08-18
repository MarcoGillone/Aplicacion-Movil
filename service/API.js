export const API_base = 'https:/jsonplaceholder.typicode.com';

async function get(path) {
    const url  = `${API_base}${path}`;
    try{
        const respuesta = await fetch(url);
        if (!respuesta.ok){
            let extra = '';
            try{
                extra = await respuesta.text();
            }catch{}
        }
        return await respuesta.json();
    }catch(error){
        throw new Error('no se pudieron cargar los datos',error);
    }
}
export async function fetchPosts() {
    return get('/posts')
};

export async function fetchUsers() {
    return get('/users')
};

export default {
    fetchPosts,fetchUsers
};