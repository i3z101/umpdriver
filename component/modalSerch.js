import React from 'react'
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import { Divider, Text } from 'react-native-paper'
import Color from '../constants/Color'


const SearchPlaceView=props=>{
    const autoCompletePlaces= props.autoCompletePlaces
    
    return <View style={styles.container}>
       <Text>{props.title}</Text>
       <Divider/>
    </View>

   
}

const styles= StyleSheet.create({
    container: {
        flex:1,
        borderWidth:1,
        borderRadius:25,
        backgroundColor:Color.white,
        padding:15
    }
})

export default SearchPlaceView