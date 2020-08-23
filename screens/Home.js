import React from 'react'
import {View, Text, StyleSheet, Platform,TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../component/HeaderButton'
import { DrawerActions } from '@react-navigation/native';
import Color from '../constants/Color';
import Card from '../component/Card';
import { Button } from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons'



const Home= props=>{
    let Touchable;
    if(Platform.OS==='android'){
        Touchable= TouchableWithoutFeedback
    }
    else{
        Touchable= TouchableOpacity
    }
    return <View style={styles.container}>
    <View style={styles.cardContainer}>
    <Touchable onPress={()=>props.navigation.navigate('PickUp')}>
    <Card container={{justifyContent:'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
        Go somewhere
        </Text>
        
        </View>
        <View style={styles.icon}>
            <Ionicons name={Platform.OS==='android'?'md-car':'ios-car'} size={40} color={Color.Primary}/>
        </View>
    </Card>
    </Touchable>
    <Touchable onPress={()=>props.navigation.navigate('Delivery')}>
    <Card container={{justifyContent:'center'}}>
    <View style={styles.textContainer}>
    <Text style={styles.text}>
        Delivery
    </Text>
    
    </View>
    <View style={styles.icon}>
        <Ionicons name={Platform.OS==='android'?'md-send':'ios-send'} size={40} color={Color.Primary}/>
    </View>
  </Card>
  </Touchable>
    </View>
   
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Color.white
    },
    cardContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    text:{
        color:Color.Second,
        fontSize:17,
        fontWeight:'400',
    },
    textContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5
    },
    icon:{
        alignItems:'center'
    }
})

export const OrderOptionStyle= navData=>{
    return{
       headerLeft: ()=>(
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
           <Item
           iconName={Platform.OS==='android'? 'md-menu' : 'ios-menu'}
           title='menu'
           onPress={()=>{navData.navigation.dispatch(DrawerActions.openDrawer());}}
           color={Color.Second}
           iconSize={24}
           />
           </HeaderButtons>
       ),
       headerTintColor: Color.Second 
    }
   
}

export default Home