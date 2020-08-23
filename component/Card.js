import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import Color from '../constants/Color';


const Card=props=>{
  
    return <View style={{...styles.container, ...props.style}} >
        <View style={{...styles.cardContainer, ...props.container}}>
        {props.children}
        </View>
    
        </View>
}

const styles= StyleSheet.create({
    container:{
        width: Dimensions.get('window').width/2.5,
        height:Dimensions.get('window').height/5.5,
        marginHorizontal:10
        
       
    },
    cardContainer:{
        width:'100%',
        height:'100%',
        backgroundColor:Color.white,
        borderRadius:10,
        shadowRadius:6,
        shadowOffset:{width:2, height:0},
        elevation:5,
        shadowColor:'black',
        shadowOpacity:0.55,
        
    }
 
})

export default Card