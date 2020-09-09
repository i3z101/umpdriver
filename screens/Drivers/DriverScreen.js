import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet,Text, Platform, FlatList, RefreshControl } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import Color from '../../constants/Color'
import {WaveIndicator, SkypeIndicator} from 'react-native-indicators';
import { Card, Avatar } from 'react-native-elements'

import { Button, DataTable } from 'react-native-paper'

const DriverScreen= props=>{
  let mounted=false;
    
  useEffect(()=>{
      mounted= true
       
       if(mounted){
           getDeliveryOrders()
       }
       return ()=>{
          mounted=false
          
          
          };
   },[])

  

  
  const [deliveryOrder, setDeliveryOrders]= useState([]);
  const [refresh,setRefresh]= useState(false) 

  


  const getDeliveryOrders= useCallback(async()=>{
      try{
          setRefresh(true)
          let orderDetails=[]
          const data= await fetch('https://ump-driver.firebaseio.com/deliveryOrder.json',{
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
              serviceType: response[key].serviceType,
              description: response[key].description.replace('\n',','),
              address:response[key].address,
              googleMapUrl: response[key].googleMapUrl,
              time: response[key].time

          })
          
      }
      setDeliveryOrders(orderDetails)
      setRefresh(false)
  }catch(err){
      console.log(err);
      throw err
  }
  },[])
  
    return <View style={{flex:1}}>
    {deliveryOrder.length!==0? 
        <FlatList
        onRefresh={getDeliveryOrders}
        refreshing={refresh}
        data={deliveryOrder}
        keyExtractor={item=>item.id}
        renderItem={itemData=>{
            return <Card containerStyle={styles.containerStyle}>
            <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
           
            <Avatar rounded source={require('../../assets/favicon.png')} size={'medium'}/>
           
            <Text style={{fontWeight:'700',  color:Color.lightBlue}}>Abdulaziz Ahmed</Text>
              
           
            </View>
            
              <DataTable>
              <DataTable.Header>
                <DataTable.Title><Text style={styles.fromText}>From</Text></DataTable.Title>
                <DataTable.Cell> <Text style={styles.fromData}>{itemData.item.serviceType}</Text></DataTable.Cell>
                <DataTable.Title numeric><Text style={{fontWeight:'600', color:Color.Primary}}>Time</Text></DataTable.Title>
              <DataTable.Cell numeric> <Text style={{fontWeight:'700', color:Color.lightBlue}}>{itemData.item.time}</Text></DataTable.Cell>
              </DataTable.Header>
              <DataTable.Header>
              <DataTable.Title><Text style={styles.toText}>To</Text></DataTable.Title>
              <DataTable.Cell numeric={itemData.item.address.length>16?false:true}> <Text style={styles.toData}>{itemData.item.address}</Text></DataTable.Cell>
              </DataTable.Header>

             
               
               
              
              
              </DataTable>
               
              <View>
              <Text style={styles.descriptionText}>Description</Text>
               <Text style={styles.descriptionData}>{itemData.item.description}</Text>
             </View>
                
                <View style={styles.btnContainer}>
                 <Button children='Accept' mode='contained' onPress={()=>{}} color={Color.lightBlue} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                 <Button children='Reject' mode='contained' onPress={()=>{}} color={'tomato'} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                </View>
                
               
            </Card>
        }}
        />: <WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>}
      
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
    descriptionText:{
      marginTop:5,
      alignSelf:'center',
      fontWeight:'700',
      color:Color.Primary
    },
    descriptionData:{
      marginTop:5, 
      marginBottom:10,
      fontWeight:'600',
      color:Color.lightBlue,
      padding:5,
      maxWidth:'80%'
    },
    fromText:{
      fontWeight:'700', 
      color:Color.Primary
    },
    fromData:{
      fontWeight:'700',
      color:Color.lightBlue
    },
    toText:{
        fontWeight:'700', 
        color:Color.Primary
    },
    toData:{
      fontWeight:'700',
        color:Color.lightBlue
    }
})

export const driverOptions= navData=>{
  return{
    headerBackTitleVisible:false,
    headerTintColor:Color.Second 
}
    
}

export default DriverScreen