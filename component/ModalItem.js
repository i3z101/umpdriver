import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Color from '../constants/Color'
import {Button} from 'react-native-paper'
import DriverInfo from './DriverInfo'
const ModalItem= props=>{
    return  <View style={{flex:1, borderBottomWidth:1,}} >
    <View style={{alignItems:'center', borderWidth:1, padding:10, margin:15, backgroundColor:Color.Primary}}>
    <Text style={{color:Color.white}}>ORDER SUMMARY</Text>
    </View>
    <View style={styles.containerModal}>
    <Text style={styles.textTitle}>FROM</Text>
    <Text style={styles.textTitle}>TO</Text>
    <Text style={styles.textTitle}>TIME</Text>
    </View>

        <View style={styles.containerModalDetails}>
        
       <View style={{width:'22%'}}> 
       <Text>{props.serviceType}</Text>
       </View>
       <View style={{width:'20%'}}><Text>{props.address}</Text></View>
       
       <View style={{width:'20%'}}><Text>{props.time}</Text></View>
        
        
        
    </View>
    <View style={{alignItems:'center', borderWidth:1, padding:10, margin:15, backgroundColor:Color.Primary}}>
    <Text style={{color:Color.white}}>DRIVER INFORMATION</Text>
    </View>
    <DriverInfo
    driverName={props.driverName}
    carName={props.carName}
    driverCarModel={props.driverCarModel}
    driverCarColor={props.driverCarColor}
    />
    <View style={styles.buttonContainer}>
    <Button
    children='cancel the order'
    mode='contained'
    onPress={props.onPress}
    style={styles.buttonCancel}
    theme={{
        colors:{
            primary:'tomato'
        },
        roundness:20
    }}
    />
    
    </View>
    </View>
}

const styles=StyleSheet.create({
    containerModal:{
        justifyContent:'space-around', 
        flexDirection:'row', 
        marginVertical:15, 
        borderBottomEndRadius:10
       },
       containerModalDetails:{
        justifyContent:'space-around', 
        flexDirection:'row', 
        marginVertical:8.5, 
       marginLeft:'7%'
        
        // width:'110%'
       },
       textTitle:{
           fontSize:16,
           fontWeight:'bold'
       },
       buttonContainer:{
            alignItems:'center',
            marginVertical:10
       },
       buttonCancel:{
           padding:1,
           width:'60%'
       }
})
export default ModalItem