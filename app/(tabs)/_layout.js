import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function TabsLayout (){
    return(
        <Tabs screenOptions={{
            headerShown:true, //monstrar el titulo de la tab
            tabBarActiveTintColor:'#098df9',
            tabBarLabelStyle:{fontSize:12}
        }} >
        {/*Pantalla publicaciones */}
        <Tabs.Screen
                name="posts"
                options={{
                title: "Publicaciones",    // Título del header
                tabBarLabel: "Publicaciones",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="newspaper-outline" size={size} color={color} />
                ),
                }}
            />

            <Tabs.Screen
                name="favoritos"
                options={{
                title: "Favoritos",    // Título del header
                tabBarLabel: "Favoritos",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="heart-outline" size={size} color={color} />
                ),
                }}
            />



            <Tabs.Screen
                name="configuracion"
                options={{
                title: "Configuracion",    // Título del header
                tabBarLabel: "Configuracion",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings-outline" size={size} color={color} />
                ),
                }}
            />

        </Tabs>
        
    );
}