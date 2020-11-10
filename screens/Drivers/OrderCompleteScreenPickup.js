import React,{useEffect, useState} from 'react'
import {View, Text, StyleSheet,Linking} from 'react-native'
import Color from '../../constants/Color'
import { Card, Avatar } from 'react-native-elements'
import { Button, DataTable,Dialog} from 'react-native-paper'
import { driverCompleteOrder } from '../../store/actions/actions'
import { useDispatch } from 'react-redux'
import { database } from '../../configDB'
import {FontAwesome5,Ionicons} from '@expo/vector-icons'
import LottieView from 'lottie-react-native';
let mounted;
const OrderCompletePickup= props=>{
    const dispatch= useDispatch()
    const [deliveryCanceled, setDeliveryCanceled]= useState(false)

    const driverCompleteOrder=()=>{
         database.ref('pickUpOrder/'+props.route.params.id).update({
            completed: true
        }).then(()=>{
            //dispatch(driverCompleteOrder())
            props.navigation.navigate('Pickup orders')
        })
        
    }

    const orderCancelation=()=>{
        const data= database.ref('pickUpOrder/'+props.route.params.id)
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
          <View style={styles.placeToGo}>
              <Text style={styles.placeToGoText}>Place To Go</Text>
              <Text style={styles.placeToGoData}>{props.route.params.placeName}</Text>
          </View>
        <DataTable>
        <DataTable.Header>
          <DataTable.Cell> <Text style={{fontWeight:'700'}}>{props.route.params.orderDate}</Text></DataTable.Cell>
        </DataTable.Header>

        <DataTable.Header>
          <DataTable.Title><Text style={styles.destinationText}>Destination</Text></DataTable.Title>
          <DataTable.Cell> <Text style={styles.destinationData}>{props.route.params.destination}</Text></DataTable.Cell>
          <DataTable.Title numeric><Text style={styles.priceText}>Price</Text></DataTable.Title>
          <DataTable.Cell numeric> <Text style={styles.priceData}>{props.route.params.price} RM</Text></DataTable.Cell>
        </DataTable.Header>
        
        </DataTable>
         
          
        <View style={styles.btnContainer}>
        <Button children='Complete' mode='contained' onPress={()=>driverCompleteOrder()} color={Color.lightBlue} theme={{roundness:25}} labelStyle={styles.labelStyle}/>
       </View>
          
         
      </Card>:deliveryCanceled&&<Dialog visible={deliveryCanceled}>
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


export default OrderCompletePickup