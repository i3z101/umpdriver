import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../component/HeaderButton'
import { DrawerActions } from '@react-navigation/native';
import Color from '../constants/Color';
import {Ionicons} from '@expo/vector-icons';

const Filter= props=>{
    return <View style={styles.container}>
    <Text>Filter Screen...</Text>
    
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})


export const FilterOption= navData=>{
    return{
       headerLeft: ()=>(
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
           <Item
           IconComponent={Ionicons}
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

export default Filter