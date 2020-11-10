import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet,YellowBox, AsyncStorage, View} from 'react-native';
import ContainerNavigation from './navigation/ContainerNavigation';
import {applyMiddleware,combineReducers,createStore} from 'redux'
import {Provider, useDispatch} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import pickUpReducer from './store/reducers/PickUpReducer';
import deliveryReducer from './store/reducers/DeliveryReducer';
import driverReducer from './store/reducers/driverReducer';
import { ddv, initDb } from './dbSQL';
import authReducer from './store/reducers/AuthReducer'


export default function App() {
  initDb()

  useEffect(()=>{
    YellowBox.ignoreWarnings(['Can\'t perform a React state update on an unmounted component'])
  },[])
  let spinner;
  




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
