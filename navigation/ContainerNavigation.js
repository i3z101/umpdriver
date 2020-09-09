import React, { useState } from 'react'
import {NavigationContainer} from '@react-navigation/native'
import UmpNavigationUser from './umpNavigationUser'
import UmpNavigationDriver from './umpNavigationDriver'

const ContainerNavigation= props=>{
    const [driverScreen, setDriverScreen]= useState(true)
    return <NavigationContainer>
        {driverScreen? <UmpNavigationDriver/>:<UmpNavigationUser/>}
    </NavigationContainer>
}

export default ContainerNavigation