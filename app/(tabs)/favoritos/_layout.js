import {Stack} from 'expo-router';

export default function PostsLayout(){
    return (
        <Stack screenOptions={{headerShown: true}}>  
        <Stack.Screen name='index' options={{title:'Favoritos'}} />
        </Stack>
    
    );
}