import React, { useState } from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer'
import Filter, {FilterOption} from '../screens/Filter'
import Home, { OrderOptionStyle } from '../screens/Users/Home'
import Profile, {ProfileOption} from '../screens/Profile'
import UserSearch,{searchOption} from '../screens/Users/UserSearch'
import Color from '../constants/Color'
import {Ionicons} from '@expo/vector-icons'
import { Platform, Text } from 'react-native'
import DeliveryScreen, {DeliveryOptionStyle} from '../screens/Users/DeliveryScreen'
import PickUpScreen,{PickUpOptionStyle} from '../screens/Users/pickUpScreen'
import Chat from '../screens/Chat'

const UmpNavigationUser= props=>{
    const Stack= createStackNavigator()
    const Drawer= createDrawerNavigator()
    const Bottom= createMaterialBottomTabNavigator()

    const OrderNavigation=()=>{
        return <Stack.Navigator screenOptions={{
            headerStyle:{
                backgroundColor:Color.Primary
            }
        }} initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={OrderOptionStyle}/>
        <Stack.Screen name='PickUp' component={PickUpScreen} options={PickUpOptionStyle}/>
        <Stack.Screen name='Delivery' component={DeliveryScreen} options={DeliveryOptionStyle}/>
        <Stack.Screen name='chat' component={Chat} options={
            (props)=>({
                headerTitle: props.route.params.userName,
                headerBackTitleStyle:{
                    color:'black',
                },
                headerTintColor:'black'
            })
        }/>
        </Stack.Navigator>
    }

    const SearchNavigation= ()=>{
        return<Stack.Navigator screenOptions={{
            headerStyle:{
                backgroundColor:Color.Primary
            },
            
        }}>
        <Stack.Screen name='Search' component={UserSearch} options={searchOption}/>
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
            tabBarColor:Color.Primary,
        }} />
        <Bottom.Screen name='Seacrh' component={SearchNavigation}  options={{
            tabBarIcon:()=>{
                return <Ionicons name={Platform.OS==='android'? 'md-search': 'ios-search'} size={24} color={Color.Second}/>
            },
            tabBarColor:Color.white
        }}/>
        <Bottom.Screen name='Profile' component={ProfileNavigation}  options={{
            tabBarIcon:()=>{
                return <Ionicons name={Platform.OS==='android'? 'md-person': 'ios-person'} size={24} color={Color.Second}/>
            },
            tabBarColor:Color.Primary
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
        activeBackgroundColor:Color.Primary,
        activeTintColor: Color.Second,                          
    }}
    >

    <Drawer.Screen name='Order' component={BottomNavigator} options={{
        gestureEnabled:false
    }}/>
    <Drawer.Screen name='Filter' component={FilterNavigator} options={{
        gestureEnabled:false
    }}/>
    
    </Drawer.Navigator>

}

export default UmpNavigationUser