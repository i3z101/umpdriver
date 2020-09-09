import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ContainerNavigation from './navigation/ContainerNavigation';
import {applyMiddleware,combineReducers,createStore} from 'redux'
import {Provider} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import pickUpReducer from './store/reducers/PickUpReducer';
import deliveryReducer from './store/reducers/DeliveryReducer';
import driverReducer from './store/reducers/driverReducer';

const rootReducers= combineReducers({
  pickUp: pickUpReducer,
  delivery: deliveryReducer,
  driver: driverReducer
})

const store= createStore(rootReducers, applyMiddleware(ReduxThunk))

export default function App() {
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
