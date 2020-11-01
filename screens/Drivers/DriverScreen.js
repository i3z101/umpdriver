import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet,Text, Platform, FlatList, RefreshControl } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import Color from '../../constants/Color'
import {WaveIndicator, SkypeIndicator} from 'react-native-indicators';
import { Card, Avatar } from 'react-native-elements'
import { database } from '../../configDB'
import { Button, DataTable,Dialog } from 'react-native-paper'
import { driverNotCompleteOrder, findDriver } from '../../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux'
import {acceptOrderInfo, driverCompleteOrder} from '../../store/actions/actions'
import {fetchDriverData} from '../../dbSQL'
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';


let driverInfo;
let delivery;
let orderId
const DriverScreen= props=>{

    //declare variables

  let mounted=false;
  let spinner;
  let fail;
  driverInfo= useSelector(state=>state.driver.driver)
  delivery= useSelector(state=>state.delivery.deliveryOrder)
  orderId= useSelector(state=>state.driver.driverCompleteOrder.orderId)
  const [deliveryOrder, setDeliveryOrders]= useState({
      listOrders:[]
  });
  const [deliveryCanceled, setDeliveryCanceled]= useState(false)
  const [refresh,setRefresh]= useState(false)
  const dispatch= useDispatch()

  

  //declare functions

  const getDeliveryOrders= useCallback(async()=>{

    setRefresh(true)
    const data= database.ref('deliveryOrder')
        data.on('value', (res=>{
            setDeliveryOrders({
                listOrders:[]
            })
           
            const fetchedData= res.val()
            let orderDetails=[]
            for(const key in fetchedData){
                orderDetails.push({
                    id: key,
                    orderDate:fetchedData[key].orderDate,
                    serviceType: fetchedData[key].serviceType,
                    description: fetchedData[key].description,
                    address: fetchedData[key].address,
                    googleMapUrl: fetchedData[key].googleMapUrl,
                    time: fetchedData[key].time,
                    finddri:fetchedData[key].findDriver
                })
            }
            setDeliveryOrders(prevState=>({
                ...prevState,
                listOrders: prevState.listOrders.concat(orderDetails.reverse().filter(order=>order.finddri===false)) 
            }))
            setRefresh(false)
        }))

  },[])

  const acceptOrder= async(id)=>{
    const dbResponse= await fetchDriverData();
    const dbResult= await dbResponse.rows._array;
     await database.ref('deliveryOrder/'+id).update({
        findDriver:true,
        driverDetails:{
          driverFirstName: dbResult[0].driverFirstName,
          driverLastName: dbResult[0].driverLastName,
          driverCarName: dbResult[0].driverCarName,
          driverCarModel: dbResult[0].driverCarModel,
          driverLicensePlate: dbResult[0].driverLicensePlate,
          driverCarColor:dbResult[0].driverCarColor,
        }
    })

    const orderIndex= deliveryOrder.listOrders.findIndex(order=>order.id===id)
    database.ref('driverOrder/deliveryOrder/'+dbResult[0].id+'/'+id).push(JSON.parse(JSON.stringify(deliveryOrder.listOrders[orderIndex])))
    dispatch(driverNotCompleteOrder(deliveryOrder.listOrders[orderIndex].id))
      
    props.navigation.navigate('complete Order delivery', {
      userName: 'Abdulaziz baqaleb',
      id: deliveryOrder.listOrders[orderIndex].id,
      orderDate:deliveryOrder.listOrders[orderIndex].orderDate,
      serviceType: deliveryOrder.listOrders[orderIndex].serviceType,
      description: deliveryOrder.listOrders[orderIndex].description,
      address: deliveryOrder.listOrders[orderIndex].address,
      googleMapUrl: deliveryOrder.listOrders[orderIndex].googleMapUrl,
      time: deliveryOrder.listOrders[orderIndex].time,
    });
      
    
    
}

const rejectOrder= (id)=>{
    let updatedOrder=[]
    const deliveryOrderCopy= [...deliveryOrder.listOrders]
    const orderIndex= deliveryOrderCopy.findIndex(order=>order.id===id)
    if(!deliveryOrderCopy[orderIndex]){
        return deliveryOrderCopy
    }
    const deletedOrder= deliveryOrderCopy.filter(order=>order.id!==id)
    setDeliveryOrders(prevState=>({
        ...prevState,
        listOrders: deletedOrder.reverse()
    }))
}

 
//useEffect(s)

useEffect(()=>{
    mounted= true
     
     if(mounted){
         getDeliveryOrders()
     }
     return ()=>{
        mounted=false
        
        
        };
 },[])

 useEffect(()=>{
  if(orderId){
      const data= database.ref('deliveryOrder/'+orderId)
      data.once('value', response=>{
        const result= response.val()
        if(result){
          if(!result.completed){
            props.navigation.navigate('complete Order delivery', {
              userName: 'Abdulaziz baqaleb',
              id:response.key,
              orderDate:result.orderDate,
              serviceType: result.serviceType,
              description: result.description,
              address: result.address,
              googleMapUrl: result.googleMapUrl,
              time: result.time,
          });
            }
        }
        else{
         dispatch(driverCompleteOrder())
         
        }
      })

  }
 },[])

 useEffect(()=>{
  fail= props.route.params?props.route.params.fail:null;
   if(fail){
    setDeliveryCanceled(true)
   }
  
 },[fail, props.route.params])


if(refresh){
    spinner= <WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>
}else{
    spinner=<View style={{justifyContent:'center', alignItems:'center', flex:1}}>
    <Text>No More Orders (:</Text>
</View>
}
  
    return <View style={{flex:1}}>
    {deliveryOrder.listOrders.length!==0? 
        <FlatList
        onRefresh={getDeliveryOrders}
        refreshing={refresh}
        data={deliveryOrder.listOrders}
        keyExtractor={item=>item.id}
        renderItem={itemData=>{
            return <Card containerStyle={styles.containerStyle}>
            <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
           
            <Avatar rounded source={require('../../assets/favicon.png')} size={'medium'}/>
           
            <Text style={{fontWeight:'700',  color:Color.lightBlue}}>Abdulaziz Ahmed</Text>
              
           
            </View>
            
              <DataTable>
              <DataTable.Header>
                    <DataTable.Cell> <Text style={{fontWeight:'700'}}>{itemData.item.orderDate}</Text></DataTable.Cell>
              </DataTable.Header>
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
                 <Button children='Accept' mode='contained' onPress={acceptOrder.bind(this, itemData.item.id)} color={Color.lightBlue} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                 <Button children='Reject' mode='contained' onPress={rejectOrder.bind(this, itemData.item.id)} color={'tomato'} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                </View>
                
               
            </Card>
        }}
        />: spinner}

        {deliveryCanceled&&<Dialog visible={deliveryCanceled}>
        <Dialog.Content>
            {Platform.OS==='ios'? <LottieView source={require('../../assets/UI/sadFace.json')} autoPlay={true} loop={true} style={{width:'70%', alignSelf:'center'}} speed={1.5}/>:<FontAwesome5 name="sad-tear" size={50} color={Color.lightBlue} style={{alignSelf:'center'}} />}
        </Dialog.Content>
        <Dialog.Title style={{textAlign:'center', marginTop:Platform.OS==='ios'?'-15%':0}}>
            <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>Sorry for that, Delivey is canceled</Text>
        </Dialog.Title>
        <Dialog.Content style={{width:'80%', alignSelf:'center'}}>
            <Button mode='contained' children="OKAY):" color={Color.lightBlue} onPress={()=>setDeliveryCanceled(false)}/>
        </Dialog.Content>
    </Dialog>}
      
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
    headerTintColor:Color.Second,
    headerTitleAlign: 'center'
}
    
}

export default DriverScreen