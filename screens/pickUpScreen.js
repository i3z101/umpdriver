import React, { useEffect } from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import Color from '../constants/Color';
import MapPreview from '../component/MapPreview';
import * as MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import SearchBarView from '../component/SearchBar';

const PickUpScreen= props=>{
    const getPermission= async()=>{
        const status= await Permissions.askAsync(Permissions.LOCATION)
        if(status.status!=='granted'){
            Alert.alert("Sorry", "You have disabled the location, please oen it from setings", [{text:'GOT It', style:'default'}])
            return false;
        }
    }

    const permitted= async()=>{
        const hasPermission= await getPermission()
        if(!hasPermission){
           return;
        }
    }

    useEffect(()=>{
        permitted()
    },[])

    return <View style={styles.container}>
  
    <MapPreview/>
    
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
    }
})

export const PickUpOptionStyle= navData=>{
    return{
       headerTintColor: Color.Second,
       headerShown:false
    }
}

export default PickUpScreen
