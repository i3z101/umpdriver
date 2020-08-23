import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Color from '../constants/Color';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../component/HeaderButton'
const Profile= props=>{
    return <View style={styles.container}>
    <Text>Profile Screen...</Text>
    
    </View>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export const ProfileOption= navData=>{
    return{
       headerRight: ()=>(
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
           <Item
           iconName={Platform.OS==='android'? 'md-checkmark' : 'ios-checkmark'}
           title='menu'
           onPress={()=>{}}
           color={Color.Second}
           iconSize={30}
           />
           </HeaderButtons>
       ),
       headerTintColor: Color.Second 
    }
}

export default Profile