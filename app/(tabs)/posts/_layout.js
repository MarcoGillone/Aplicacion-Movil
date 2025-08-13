import {Stack} from 'expo-router';

export default function PostsLayout(){
    return (
        <Stack screenOptions={{headerShown: true}}>  
        <Stack.Screen name='index' options={{title:'Publicaciones'}} />
        <Stack.Screen name='[id]' options={{title:'Detalles publicacion'}} />
        </Stack>
    
    );
}