import React,{useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Color from '../../constants/Color'
import { Card, Avatar } from 'react-native-elements'
import { Button, DataTable } from 'react-native-paper'
import { driverCompleteOrder } from '../../store/actions/actions'
import { useDispatch } from 'react-redux'
import { database } from '../../configDB'

let mounted;
const OrderCompletePickup= props=>{
    const dispatch= useDispatch()

    const driverCompleteOrder=()=>{
         database.ref('pickUpOrder/'+props.route.params.id).update({
            completed: true
        }).then(()=>{
            //dispatch(driverCompleteOrder())
            props.navigation.goBack()
        })
        
    }

    const orderCancelation=()=>{
        const data= database.ref('pickUpOrder/'+props.route.params.id)
        data.on('value', response=>{
          const result= response.val()
            if(!result){
              props.navigation.navigate('Pickup orders',{
                fail:true
              })
            }
        })
    }


    useEffect(()=>{
      mounted= true
      if(mounted){
        orderCancelation()
      }
      return ()=>mounted=false
    },[])


    return(
      <Card containerStyle={styles.containerStyle}>
      <View style={{alignItems:'center',flexDirection:'row-reverse', justifyContent:'space-around', marginTop:10}}>
     
      <Avatar rounded source={require('../../assets/favicon.png')} size={'medium'}/>
     
      <Text style={{fontWeight:'700',  color:Color.lightBlue}}>{props.route.params.userName}</Text>
        
     
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
          
         
      </Card>
    )
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