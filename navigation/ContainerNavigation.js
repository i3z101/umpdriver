import React, { useEffect, useRef, useState } from 'react'
import {NavigationContainer} from '@react-navigation/native'
import UmpNavigationUser from './umpNavigationUser'
import UmpNavigationDriver from './umpNavigationDriver'
import { AsyncStorage, Dimensions, Image, Platform, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import UserAUth from '../screens/Users/UserAuth'
import DriverAuth from '../screens/Drivers/DriverAuth'
import {autoAuth, didTryAuth} from '../store/authAction/authAction'
import {PulseIndicator} from 'react-native-indicators'
import Color from '../constants/Color'
import welcome from '../assets/images/welcome.jpg'
import * as Progress from 'react-native-progress';

let idToken;
let spinner;
let userMode;
let progressNum= 0;
const ContainerNavigation= props=>{
    
    const dispatch= useDispatch()
    const [showSpinner, setShowSpinner]= useState(false)
    

    useEffect(()=>{
        const tryToAuth= async()=>{
          const data= await AsyncStorage.getItem('userDetails')
          if(!data){
            return false;
          }
          const userDetails= JSON.parse(data)
          const {idToken, userId, userMode, expirationTime}= userDetails
          if(expirationTime <= new Date().getTime() || !idToken || !userId){
            dispatch(didTryAuth())
          }
          // console.log("today:",new Date().getHours());
          // console.log("for auth:", new Date(expirationTime).getHours());
          dispatch(autoAuth(userMode, idToken, userId))
        }
  
        tryToAuth()
    },[])

    useEffect(()=>{
      setShowSpinner(true)
      setTimeout(()=>{
        setShowSpinner(false)
      },1000)
    },[])


   
    if(showSpinner){
      spinner= (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Image source={welcome} style={{width:'100%', height:'55%'}}/>
          <Progress.Bar progress={1} width={200} indeterminate indeterminateAnimationDuration={1000}/>
        </View>
      )
    }

    idToken= useSelector(state=>state.auth.idToken)
    //driverAuth= useSelector(state=>state.auth.driverAuth.driverVerified)
    userMode= useSelector(state=>state.auth.userMode)
    return showSpinner?spinner:<NavigationContainer>
        {idToken&&userMode&&<UmpNavigationUser/>}
        {!idToken&&userMode&&<UserAUth/>}
        {idToken&&!userMode&&<UmpNavigationDriver/>}
        {!idToken&&!userMode&&<DriverAuth/>}
    </NavigationContainer>
}

export default ContainerNavigation