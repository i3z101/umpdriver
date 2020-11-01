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

let orderId
let fail;
const DriverScreen= props=>{

    //declare variables

    let mounted=false;
    let spinner;
    orderId= useSelector(state=>state.driver.driverCompleteOrder.orderId)
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
                    placeName: fetchedData[key].placeName,
                    destination: fetchedData[key].destination,
                    arrivalTime: fetchedData[key].arrivalTime,
                    price: fetchedData[key].price,
                    findDri: fetchedData[key].findDriver
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
        const dbResponse= await fetchDriverData();
        const dbResult= await dbResponse.rows._array;
         await database.ref('pickUpOrder/'+id).update({
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
        const orderIndex= pickupOrders.listOrders.findIndex(order=>order.id===id)
        database.ref('driverOrder/pickUpOrder/'+dbResult[0].id+'/'+id).push(JSON.parse(JSON.stringify(pickupOrders.listOrders[orderIndex])))
        dispatch(driverNotCompleteOrder(pickupOrders.listOrders[orderIndex].id))
        props.navigation.navigate('complete Order pickup', {
            userName: 'Abdulaziz baqaleb',
            id: pickupOrders.listOrders[orderIndex].id,
            orderDate:pickupOrders.listOrders[orderIndex].orderDate,
            placeName: pickupOrders.listOrders[orderIndex].placeName,
            destination: pickupOrders.listOrders[orderIndex].destination,
            arrivalTime: pickupOrders.listOrders[orderIndex].arrivalTime,
            price: pickupOrders.listOrders[orderIndex].price,
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
                      userName: 'Abdulaziz baqaleb',
                      id:response.key,
                      orderDate:result.orderDate,
                      placeName: result.placeName,
                      destination: result.destination,
                      arrivalTime: result.address,
                      price: result.price,
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
        {pickupOrders.listOrders.length!==0? <FlatList
            onRefresh={getPickupOrders}
            refreshing={refresh}
            data={pickupOrders.listOrders}
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
        headerTintColor:Color.Second,
        headerTitleAlign:'center'
    }
    
}

export default DriverScreen