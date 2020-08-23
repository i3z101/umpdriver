import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CustomHeaderButton from '../component/HeaderButton'
import Color from '../constants/Color';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
const UserSearch= props=>{
    return <View style={styles.container}>
    <Text>UserSearch Screen...</Text>
    
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export const searchOption= navData=>{
    return{
       headerTintColor: Color.Second 
    }
}
export default UserSearch