import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function TabsLayout (){
    return(
        <Tabs screenOptions={{
            headerShown:true, //monstrar el titulo de la tab
            tabBarActiveTintColor:'#098df9',
            tabBarLabelStyle:{fontSize:12}
        }} />
        {/*Pestaña publicaciones */}

    );
}