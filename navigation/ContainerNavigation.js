import React, { useState } from 'react'
import {NavigationContainer} from '@react-navigation/native'
import UmpNavigationUser from './umpNavigationUser'
import UmpNavigationDriver from './umpNavigationDriver'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'
import UserAUth from '../screens/Users/UserAuth'
import DriverAuth from '../screens/Drivers/DriverAuth'

let idToken;
//let driverAuth;
let userMode;
const ContainerNavigation= props=>{

    idToken= useSelector(state=>state.auth.idToken)
    //driverAuth= useSelector(state=>state.auth.driverAuth.driverVerified)
    userMode= useSelector(state=>state.auth.userMode)
    return <NavigationContainer>
        {idToken&&userMode&&<UmpNavigationUser/>}
        {!idToken&&userMode&&<UserAUth/>}
        {idToken&&!userMode&&<UmpNavigationDriver/>}
        {!idToken&&!userMode&&<DriverAuth/>}
    </NavigationContainer>
}

export default ContainerNavigation