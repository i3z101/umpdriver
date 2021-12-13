import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet,Text, Platform, FlatList, ActivityIndicator } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import Color from '../../constants/Color'
import { DrawerActions } from '@react-navigation/native';
import { Card, Avatar } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { Button, DataTable,Dialog } from 'react-native-paper'
import {WaveIndicator} from 'react-native-indicators';
import { database } from '../../configDB'
import {fetchDriverData} from '../../dbSQL'
import { driverCompleteOrder, driverNotCompleteOrder } from '../../store/actions/actions'
import LottieView from 'lottie-react-native';
import { FontAwesome5 } from '@expo/vector-icons';

let orderId;
let profile;
let userId;
const DriverScreen= props=>{

    //declare variables

    let mounted=false;
    let spinner;
    orderId= useSelector(state=>state.driver.driverCompleteOrder.orderId)
    profile= useSelector(state=>state.auth.driverProfile);
    userId= useSelector(state=>state.auth.userId);
    const [pickupOrders, setPickupOrders]= useState({
        listOrders:[]
    });
    const [deliveryCanceled, setDeliveryCanceled]= useState(false)
    const [refresh,setRefresh]= useState(false) 
    const dispatch= useDispatch()
    
  
    //declare function

    const getPickupOrders= useCallback(async()=>{

        const data= database.ref('pickUpOrder')
        
        data.on('value', (res=>{
            setPickupOrders({
                listOrders:[]
            })
            setRefresh(true)
            const fetchedData= res.val()
            let orderDetails=[]
            for(const key in fetchedData){
                orderDetails.push({
                    id: key,
                    orderDate: fetchedData[key].orderDate,
                    userName: fetchedData[key].userName,
                    placeName: fetchedData[key].placeName,
                    destination: fetchedData[key].destination,
                    arrivalTime: fetchedData[key].arrivalTime,
                    price: fetchedData[key].price,
                    findDri: fetchedData[key].findDriver,
                    userPhoneNumber: fetchedData[key].userPhoneNumber,
                    badge: fetchedData[key].badge,
                    avatar: fetchedData[key].avatar
                })
            }
            setPickupOrders(prevState=>({
                ...prevState,
                listOrders: prevState.listOrders.concat(orderDetails.reverse().filter(order=>order.findDri===false))
            }))
            setRefresh(false)
        }))
    },[])

    const acceptOrder= async(id)=>{
        const orderIndex= pickupOrders.listOrders.findIndex(order=>order.id===id)
         await database.ref('pickUpOrder/'+id).update({
            findDriver:true,
            driverDetails:{
                driverName: profile.fullName,
                driverCarName: profile.driverCarName,
                driverCarModel: profile.driverCarModel,
                driverLicensePlate: profile.driverLicensePlate,
                driverCarColor:profile.driverCarColor,
                driverphoneNumber:profile.phoneNumber,
                driverAvatar: profile.avatar,
                driverPushToken: profile.idPushToken
              }
        })
        await fetch("https://exp.host/--/api/v2/push/send", {
            method:"POST",
            headers:{
              'host':'exp.host',
              'accept': 'application/json',
              'accept-encoding': 'gzip, deflate',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              to: "ExponentPushToken[W0zmhWHEdcRoBZA3Qdta3t]",
              title: "ORDER WAS ACCEPTED",
              body:"Happy order",
              data: {
                page: 'PickUp',
                deliveryId: id
              },
              time: 1,
              sound: "default",
              badge: pickupOrders.listOrders[orderIndex].badge + 1,
            })
          })
        database.ref('driverOrder/pickUpOrder/'+userId+'/'+id).push(JSON.parse(JSON.stringify(pickupOrders.listOrders[orderIndex])))
        dispatch(driverNotCompleteOrder(pickupOrders.listOrders[orderIndex].id))

        props.navigation.navigate('complete Order pickup', {
            userName: pickupOrders.listOrders[orderIndex].userName,
            id: pickupOrders.listOrders[orderIndex].id,
            orderDate:pickupOrders.listOrders[orderIndex].orderDate,
            placeName: pickupOrders.listOrders[orderIndex].placeName,
            destination: pickupOrders.listOrders[orderIndex].destination,
            arrivalTime: pickupOrders.listOrders[orderIndex].arrivalTime,
            price: pickupOrders.listOrders[orderIndex].price,
            userPhoneNumber: pickupOrders.listOrders[orderIndex].userPhoneNumber,
            avatar: pickupOrders.listOrders[orderIndex].avatar,
            idPushToken:pickupOrders.listOrders[orderIndex].idPushToken,
          });
    }

    const rejectOrder= (id)=>{
        let updatedOrder=[]
        const pickupOrdersCopy= [...pickupOrders.listOrders]
        const orderIndex= pickupOrdersCopy.findIndex(order=>order.id===id)
        if(!pickupOrdersCopy[orderIndex]){
            return pickupOrdersCopy
        }
        const deletedOrder= pickupOrdersCopy.filter(order=>order.id!==id)
        setPickupOrders(prevState=>({
            ...prevState,
            listOrders: deletedOrder
        }))
    }


    //declare useEffect(s)


    useEffect(()=>{
        mounted= true
         
         if(mounted){
             getPickupOrders()
         }
         return ()=>{
            mounted=false
            };
     },[])

     useEffect(()=>{
        spinner= <WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>
     },[])

     useEffect(()=>{
        if(orderId){
            const data= database.ref('pickUpOrder/'+orderId)
            data.once('value', response=>{
              const result= response.val()
              if(result){
                if(!result.completed){
                    props.navigation.navigate('complete Order pickup', {
                      userName: result.userName,
                      id:response.key,
                      orderDate:result.orderDate,
                      placeName: result.placeName,
                      destination: result.destination,
                      arrivalTime: result.address,
                      price: result.price,
                      userPhoneNumber: result.userPhoneNumber,
                      avatar: result.avatar,
                      idPushToken: result.idPushToken
                  });
                    }
              }
              else{
               dispatch(driverCompleteOrder())
              }
            })
      
        }
       },[])
    
    

  
    
    if(refresh){
        spinner= <WaveIndicator color={Color.Primary} size={60} count={4} waveFactor={0.60} waveMode={'outline'}/>
    }else{
        spinner=<View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <Text>No More Orders (:</Text>
    </View>
    }
   
  
    return <View style={{flex:1}}>
        {pickupOrders.listOrders.length!==0? <FlatList
            onRefresh={getPickupOrders}
            refreshing={refresh}
            data={pickupOrders.listOrders}
            keyExtractor={item=>item.id}
            renderItem={itemData=>{
                return <Card containerStyle={styles.containerStyle}>
                <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
               
                <Avatar rounded source={{uri:itemData.item.avatar}} size={'medium'}/>
               
                <Text style={{fontWeight:'700',  color:Color.lightBlue}}>{itemData.item.userName}</Text>
                  
               
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

            {deliveryCanceled&&<Dialog visible={deliveryCanceled}>
            <Dialog.Content>
                {Platform.OS==='ios'? <LottieView source={require('../../assets/UI/sadFace.json')} autoPlay={true} loop={true} style={{width:'70%', alignSelf:'center'}} speed={1.5}/>:<FontAwesome5 name="sad-tear" size={50} color={Color.lightBlue} style={{alignSelf:'center'}} />}
            </Dialog.Content>
            <Dialog.Title style={{textAlign:'center', marginTop:Platform.OS==='ios'?'-15%':0}}>
                <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>Sorry for that, Pickup is canceled</Text>
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
        headerTintColor:Color.white,
        headerTitleAlign:'center'
    }
    
}

export default DriverScreen