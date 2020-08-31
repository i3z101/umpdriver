import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { Searchbar } from 'react-native-paper'
import Color from '../constants/Color'

const SearchBarView= props=>{
    return <Searchbar
        placeholder='Search a place'
        value={props.value}
        onChangeText={props.onChangeText}
       icon={()=>props.icon}
        theme={{
            colors:{
                primary:Color.Primary
            }
        }}
        iconColor={Color.Primary}
        placeholderTextColor={Color.Second}
        inputStyle={{
            textAlign:'center'
        }}
        style={{borderRadius:40}}
        // onSubmitEditing={props.onSubmit}
        onEndEditing={props.onSubmit}
    />
}

const styles= StyleSheet.create({
    inputStylesContainer:{
        width:'80%'
    }
})


export default SearchBarView