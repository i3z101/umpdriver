import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import Color from '../constants/Color';
const PickUpScreen= props=>{
    return <View style={styles.container}>
    <Text>PickUpScreen Screen...</Text>
    
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export const PickUpOptionStyle= navData=>{
    return{
       headerTintColor: Color.Second 
    }
}

export default PickUpScreen
