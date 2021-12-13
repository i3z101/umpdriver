import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet,YellowBox, AsyncStorage, View, Alert, Button} from 'react-native';
import ContainerNavigation from './navigation/ContainerNavigation';
import {applyMiddleware,combineReducers,createStore} from 'redux'
import {Provider, useDispatch} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import pickUpReducer from './store/reducers/PickUpReducer';
import deliveryReducer from './store/reducers/DeliveryReducer';
import driverReducer from './store/reducers/driverReducer';
import { ddv, initDb } from './dbSQL';
import authReducer from './store/reducers/AuthReducer'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification:async()=>{
    return{
      shouldShowAlert:true,
      shouldPlaySound:true,
      shouldSetBadge: true
    }
  }  
})

 

export default function App() {

  // useEffect(()=>{
  //   const getBadge= async()=>{
  //     Notifications.setBadgeCountAsync(10).then(()=>{
  //       Notifications.getBadgeCountAsync().then((b)=>{
  //         console.log(b);
  //       })
  //     })
  //   }
  //   getBadge()
  //  },[])
  
  const getNotificationPermission= async()=>{
        const result= await Notifications.getPermissionsAsync()
        if(result.status!=='granted'){
          const requestPermission= await Notifications.requestPermissionsAsync()
          if(requestPermission.status!=='granted'){
            console.log("kjhbhj");
            return
          }
        }else{
          return true
        }
        
  }

  // const getToken= async()=>{
    
    
  // }

  

  useEffect(()=>{
    YellowBox.ignoreWarnings(['Can\'t perform a React state update on an unmounted component'])
  },[])

  useEffect(()=>{
    getNotificationPermission()
  },[])

 
  
  



  const rootReducers= combineReducers({
    pickUp: pickUpReducer,
    delivery: deliveryReducer,
    driver: driverReducer,
    auth: authReducer
  })

  
const store= createStore(rootReducers, applyMiddleware(ReduxThunk))
  
  return (
    <Provider store={store}>
    <ContainerNavigation/>
   
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
