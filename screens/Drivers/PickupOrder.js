import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet,Text, Platform, FlatList, ActivityIndicator } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import Color from '../../constants/Color'
import { DrawerActions } from '@react-navigation/native';
import { Card, Avatar } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { Button, DataTable } from 'react-native-paper'
import {WaveIndicator} from 'react-native-indicators';
const DriverScreen= props=>{

    let mounted=false;
    
    useEffect(()=>{
        mounted= true
         
         if(mounted){
             getPickupOrders()
         }
         return ()=>{
            mounted=false
            
            
            };
     },[])

    

    
    const [pickupOrders, setPickupOrders]= useState([]);
    const [refresh,setRefresh]= useState(false) 

    
  

    const getPickupOrders= useCallback(async()=>{
        try{
            setRefresh(true)
            let orderDetails=[]
            const data= await fetch('https://ump-driver.firebaseio.com/pickUpOrder.json',{
            method:'GET'
        })
        if(!data.ok){
            console.log('Something wet wrong');
            throw new Error
        }
        const response= await data.json()
        for(const key in response){
            orderDetails.unshift({
                id: key,
                orderDate: response[key].orderDate,
                placeName: response[key].placeName,
                destination:response[key].destination,
                arrivalTime: response[key].arrivalTime,
                price: response[key].price

            })
            
        }
        setPickupOrders(orderDetails)
        setRefresh(false)
    }catch(err){
        console.log(err);
        throw err
    }
    },[])

    const acceptOrder= async(id)=>{
        try{
            const data= await fetch(`https://ump-driver.firebaseio.com/pickUpOrder/${id}.json`,{
            method:'PATCH',
            headers:{
                'Content-Type':'Application/json'
            },
            body: JSON.stringify({
                findDriver: false
            })
        })
        if(!data.ok){
            throw new Error("somewthing went wrong")
        }
    }catch(err){
        console.log(err);
        throw err
    }
    }

    const rejectOrder= (id)=>{
        let updatedOrder=[]
        const pickupOrdersCopy= [...pickupOrders]
        const orderIndex= pickupOrdersCopy.findIndex(order=>order.id===id)
        if(!pickupOrdersCopy[orderIndex]){
            return pickupOrdersCopy
        }
        const deletedOrder= pickupOrdersCopy.filter(order=>order.id!==id)
        setPickupOrders(deletedOrder)
    }

    let spinner;
    
    if(refresh){
        spinner= <WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>
    }else{
        spinner=<View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <Text>No More Orders (:</Text>
    </View>
    }
   
  
    return <View style={{flex:1}}>
        {pickupOrders.length!==0? <FlatList
            onRefresh={getPickupOrders}
            refreshing={refresh}
            data={pickupOrders}
            keyExtractor={item=>item.id}
            renderItem={itemData=>{
                return <Card containerStyle={styles.containerStyle}>
                <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
               
                <Avatar rounded source={require('../../assets/favicon.png')} size={'medium'}/>
               
                <Text style={{fontWeight:'700',  color:Color.lightBlue}}>Abdulaziz Ahmed</Text>
                  
               
                </View>
                    <View style={styles.placeToGo}>
                        <Text style={styles.placeToGoText}>Place To Go</Text>
                        <Text style={styles.placeToGoData}>{itemData.item.placeName}</Text>
                    </View>
                  <DataTable>
                  <DataTable.Header>
                    <DataTable.Cell> <Text style={{fontWeight:'700'}}>{itemData.item.orderDate}</Text></DataTable.Cell>
                  </DataTable.Header>
    
                  <DataTable.Header>
                    <DataTable.Title><Text style={styles.destinationText}>Destination</Text></DataTable.Title>
                    <DataTable.Cell> <Text style={styles.destinationData}>{itemData.item.destination}</Text></DataTable.Cell>
                    <DataTable.Title numeric><Text style={styles.priceText}>Price</Text></DataTable.Title>
                    <DataTable.Cell numeric> <Text style={styles.priceData}>{itemData.item.price} RM</Text></DataTable.Cell>
                  </DataTable.Header>
                  
                  </DataTable>
                   
                    
                    <View style={styles.btnContainer}>
                     <Button children='Accept' mode='contained' onPress={acceptOrder.bind(this, itemData.item.id)} color={Color.lightBlue} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                     <Button children='Reject' mode='contained' onPress={rejectOrder.bind(this, itemData.item.id)} color={'tomato'} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                    </View>
                    
                   
                </Card>
            }}
            />:spinner}
      
    </View>
}

const styles= StyleSheet.create({
    containerStyle:{
        borderRadius:5,
        padding:5,
        shadowColor:'black',
        shadowOffset:{width:1, height:5}, 
        shadowOpacity:0.6,
        shadowRadius:5,
        backgroundColor:'#f9f9f9'
    },
    btnContainer:{
      flexDirection:'row',
      justifyContent:'space-around',
      marginVertical:10
    },
    labelStyle:{
      fontSize:13, 
      fontWeight:'400'
    },
    placeToGo:{
        maxWidth:'85%', alignSelf:'center',marginTop:5
    },
    placeToGoText:{
        alignSelf:'center', 
        fontWeight:'600',
         color:Color.Primary, 
         marginVertical:10,
          fontSize:16
    },
    placeToGoData:{
        alignSelf:'center', 
        fontWeight:'700',  
        color:Color.lightBlue, 
        fontSize:16
    },
    destinationText:{
        fontWeight:'700', 
        color:Color.Primary
    },
    destinationData:{
        fontWeight:'700',
        color:Color.lightBlue
    },
    priceText:{
        fontWeight:'700', color:Color.Primary
    },
    priceData:{
        fontWeight:'700',
        color:Color.lightBlue
    }
})


export const PickUpOptionStyle= navData=>{
    return{
        headerBackTitleVisible:false,
        headerTintColor:Color.Second 
    }
    
}

export default DriverScreen