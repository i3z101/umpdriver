import React, { Fragment, useEffect, useState } from 'react'
import {View, Text, StyleSheet, Linking} from 'react-native'
import Color from '../../constants/Color'
import { Card, Avatar } from 'react-native-elements'
import { Button, DataTable, Dialog} from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { database } from '../../configDB'
import {FontAwesome5, Ionicons} from '@expo/vector-icons'
import LottieView from 'lottie-react-native';
let mounted;
const OrderComplete= props=>{
     mounted= false
    const dispatch= useDispatch()
    const [deliveryCanceled, setDeliveryCanceled]= useState(false)

    const driverCompleteOrder=()=>{
         database.ref('deliveryOrder/'+props.route.params.id).update({
            completed: true
        }).then(()=>{
            props.navigation.navigate('Delivery orders')
        })
    }

    const orderCancelation=()=>{
        const data= database.ref('deliveryOrder/'+props.route.params.id)
        data.on('value', response=>{
          const result= response.val()
            if(!result){
             setDeliveryCanceled(true)
            }
        })
    }

    const makeCall=()=>{
      console.log(props.userPhoneNumber);
      if(Platform.OS==='ios'){
          Linking.openURL(`telprompt:${props.route.params.userPhoneNumber}`)
      }else{
          Linking.openURL(`tel:${props.route.params.userPhoneNumber}`)
      }
  }


    useEffect(()=>{
      mounted= true
      if(mounted){
          orderCancelation()
      }
      return ()=>mounted=false
    },[])

    return !deliveryCanceled? <Card containerStyle={styles.containerStyle}>
            <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
           
            <Avatar rounded source={require('../../assets/favicon.png')} size={'medium'}/>
           
            <Text style={{fontWeight:'700',  color:Color.lightBlue}}>{props.route.params.userName}</Text>
            <Ionicons name={Platform.OS==='ios'? "ios-call":"md-call"} size={35} color={Color.lightBlue} onPress={()=>makeCall()}/> 
            </View>
            
              <DataTable>
              <DataTable.Header>
                    <DataTable.Cell> <Text style={{fontWeight:'700'}}>{props.route.params.orderDate}</Text></DataTable.Cell>
              </DataTable.Header>
              <DataTable.Header>
                <DataTable.Title><Text style={styles.fromText}>From</Text></DataTable.Title>
                <DataTable.Cell> <Text style={styles.fromData}>{props.route.params.serviceType}</Text></DataTable.Cell>
                <DataTable.Title numeric><Text style={{fontWeight:'600', color:Color.Primary}}>Time</Text></DataTable.Title>
              <DataTable.Cell numeric> <Text style={{fontWeight:'700', color:Color.lightBlue}}>{props.route.params.time}</Text></DataTable.Cell>
              </DataTable.Header>
              <DataTable.Header>
              <DataTable.Title><Text style={styles.toText}>To</Text></DataTable.Title>
              <DataTable.Cell numeric={props.route.params.address.length>16?false:true}> <Text style={styles.toData}>{props.route.params.address}</Text></DataTable.Cell>
              </DataTable.Header>
              </DataTable>
               
              <View>
              <Text style={styles.descriptionText}>Description</Text>
               <Text style={styles.descriptionData}>{props.route.params.description}</Text>
             </View>
                
                <View style={styles.btnContainer}>
                 <Button children='Complete' mode='contained' onPress={()=>driverCompleteOrder()} color={Color.lightBlue} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
                </View>
            </Card>:  deliveryCanceled&&<Dialog visible={deliveryCanceled}>
            <Dialog.Content>
                {Platform.OS==='ios'? <LottieView source={require('../../assets/UI/sadFace.json')} autoPlay={true} loop={true} style={{width:'70%', alignSelf:'center'}} speed={1.5}/>:<FontAwesome5 name="sad-tear" size={50} color={Color.lightBlue} style={{alignSelf:'center'}} />}
            </Dialog.Content>
            <Dialog.Title style={{textAlign:'center', marginTop:Platform.OS==='ios'?'-15%':0}}>
                <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>Sorry for that, Delivey is canceled</Text>
            </Dialog.Title>
            <Dialog.Content style={{width:'80%', alignSelf:'center'}}>
                <Button mode='contained' children="OKAY):" color={Color.lightBlue} onPress={()=>{
                  setDeliveryCanceled(false)
                  props.navigation.navigate('Delivery orders')
                }}/>
            </Dialog.Content>
        </Dialog>
            
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


export const OrderCompleteOption= navDate=>{
    return{
        cardStyle:{
            backgroundColor:Color.white
        },
        gestureEnabled:false,
        headerLeft:null,
        headerTitleAlign:'center'
    }
}


export default OrderComplete