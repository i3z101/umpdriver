import React, { useState } from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Filter, {FilterOption} from '../screens/Filter'
import DriverScreen, { driverOptions } from '../screens/Drivers/DriverScreen'
import Profile, {ProfileOption} from '../screens/Profile'
import Color from '../constants/Color'
import {Ionicons, AntDesign} from '@expo/vector-icons'
import { Platform } from 'react-native'
import Home, {OrderOptionStyle} from '../screens/Drivers/HomeDriver'
import PickupOrder, {PickUpOptionStyle} from '../screens/Drivers/PickupOrder'

const UmpNavigationDriver= props=>{
    const Stack= createStackNavigator()
    const Drawer= createDrawerNavigator()
    const Bottom= createMaterialBottomTabNavigator()

    const OrderNavigation=()=>{ 
        return <Stack.Navigator screenOptions={{
            headerStyle:{
                backgroundColor:Color.lightBlue
            }
        }} initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={OrderOptionStyle}/>
        <Stack.Screen name='Pickup orders' component={PickupOrder} options={PickUpOptionStyle}/>
        <Stack.Screen name='Delivery orders' component={DriverScreen} options={driverOptions}/>
        </Stack.Navigator>
    }



    
    const ProfileNavigation=()=>{
        return <Stack.Navigator screenOptions={{
            headerStyle:{
                backgroundColor:Color.lightBlue
            },
            
        }}>
        <Stack.Screen name='Profile' component={Profile} options={ProfileOption}/>
        </Stack.Navigator>
    }

    const BottomNavigator=()=>{
        return <Bottom.Navigator 
       shifting={true}
       screenOptions={{
           tabBarColor:Color.Primary,   
       }}
       activeColor={Color.Second}
        >
        <Bottom.Screen name='Home' component={OrderNavigation} options={{
            tabBarIcon:()=>{
                return <Ionicons name={Platform.OS==='android'? 'md-home': 'ios-home'} size={24} color={Color.Second}/>
            },
            tabBarColor:Color.lightBlue,
        }} />
        <Bottom.Screen name='Profile' component={ProfileNavigation}  options={{
            tabBarIcon:()=>{
                return <Ionicons name={Platform.OS==='android'? 'md-person': 'ios-person'} size={24} color={Color.Second}/>
            },
            tabBarColor:Color.lightBlue
        }}/>
    </Bottom.Navigator>
    }

    const FilterNavigator=()=>{
        return <Stack.Navigator screenOptions={{
            headerStyle:{
                backgroundColor:Color.Primary
            }
        }}>
            <Stack.Screen name='Filter' component={Filter} options={FilterOption}/>
        </Stack.Navigator>
    }

    return <Drawer.Navigator drawerContentOptions={{
        activeBackgroundColor:Color.lightBlue,
        activeTintColor: Color.white,                          
    }}
    >

    <Drawer.Screen name='Order' component={BottomNavigator} options={{
        gestureEnabled:false,
        drawerIcon:()=><AntDesign name="form" size={24} color={Color.Second} />
    }}
    />
    <Drawer.Screen name='Filter' component={FilterNavigator} options={{
        gestureEnabled:false,
        drawerIcon:()=><AntDesign name="filter" size={24} color={Color.Second} />
    }}/>
    
    </Drawer.Navigator>

}

export default UmpNavigationDriver