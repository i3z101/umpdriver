import React, { Fragment,useState,useEffect } from 'react'
import {View, Text, StyleSheet, Platform} from 'react-native'
import Color from '../constants/Color';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../component/HeaderButton'
import {Ionicons, Entypo,Foundation,Feather, FontAwesome5, Fontisto, FontAwesome} from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Card } from 'react-native-elements';
import { Divider, TextInput } from 'react-native-paper';
import {WaveIndicator} from 'react-native-indicators';
let userMode;
let profile;
const Profile= props=>{
    
    userMode= useSelector(state=>state.auth.userMode);
    if(userMode){
        profile= useSelector(state=>state.auth.userProfile);
    }else{
        profile= useSelector(state=>state.auth.driverProfile);
    }

   


    return( 
    !profile?<WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>:<View style={styles.container}>
    <Card containerStyle={styles.input}>
         <View style={styles.cardContent}>
         <Entypo name="email" size={16} color={'#999999'} />
         <Text style={styles.text}>{profile.email}</Text>        
         </View>
        
    </Card>

    <Card containerStyle={styles.input}>
    <View style={styles.cardContent}>
    <Entypo name="user" size={16} color={'#999999'} />
    <Text style={styles.text}>{profile.fullName}</Text>        
    </View>
    </Card>

    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
    <Card containerStyle={{...styles.input, width:'45%'}}>
    <View style={styles.cardContent}>
    <Entypo name="phone" size={16} color={'#999999'} />
    <Text style={styles.text}>{profile.phoneNumber}</Text>        
    </View>
    </Card>
    <Card containerStyle={{...styles.input, width:'45%'}}>
    <View style={styles.cardContent}>
    <Foundation name="male-female" size={22} color={'#999999'} />
    <Text style={styles.text}>{profile.gender}</Text>        
    </View>
    </Card>
    </View>
    
    {!userMode&&<Fragment>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
        <Card containerStyle={{...styles.input, width:'45%'}}>
        <View style={styles.cardContent}>
        <FontAwesome5 name="car" size={22} color={'#999999'} />
        <Text style={styles.text}>{profile.carName}</Text>        
        </View>
        </Card>
        <Card containerStyle={{...styles.input, width:'45%'}}>
        <View style={styles.cardContent}>
        <Fontisto name="date" size={22} color={'#999999'} />
        <Text style={styles.text}>{profile.carModel}</Text>        
        </View>
        </Card>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
        <Card containerStyle={{...styles.input, width:'45%'}}>
        <View style={styles.cardContent}>
        <FontAwesome name="drivers-license-o" size={22} color={'#999999'} />
        <Text style={styles.text}>{profile.carLicensePlate}</Text>        
        </View>
        </Card>
        <Card containerStyle={{...styles.input, width:'45%'}}>
        <View style={styles.cardContent}>
        <Ionicons name={Platform.OS==='ios'?"ios-color-palette":"md-color-palette"} size={22} color={'#999999'} />
        <Text style={styles.text}>{profile.carColor}</Text>        
        </View>
        </Card>
        </View>
        </Fragment>
    
}

    </View>
    )
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        // alignItems:'center',
        // justifyContent:'center'
    },
    input:{
        marginBottom:5,
        width:'88%',
        padding:'5%',
        textAlign:'center',
        borderRadius:10,
        backgroundColor:'#d9d9d9',
    },
    cardContent:{
        flexDirection:'row', 
        justifyContent:'space-evenly', 
        alignItems:'center'
    },
    text:{
        fontWeight:'700',
        fontSize:16
    }
})

export const ProfileOption= navData=>{
    return{
       headerRight: ()=>(
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
           <Item
           IconComponent={Feather}
           iconName={'edit'}
           title='menu'
           onPress={()=>{}}
           color={Color.Second}
           iconSize={30}
           />
           </HeaderButtons>
       ),
       headerTintColor: Color.Second,
       headerTitleAlign:'center'
    }
}

export default Profile