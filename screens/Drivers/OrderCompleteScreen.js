import React, { Fragment, useEffect, useState } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Color from '../../constants/Color'
import { Card, Avatar } from 'react-native-elements'
import { Button, DataTable } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { database } from '../../configDB'

let mounted;
const OrderComplete= props=>{
     mounted= false
    const dispatch= useDispatch()
    

    const driverCompleteOrder=()=>{
         database.ref('deliveryOrder/'+props.route.params.id).update({
            completed: true
        }).then(()=>{
            //dispatch(driverCompleteOrder())
            props.navigation.goBack()
        })
    }

    const orderCancelation=()=>{
        const data= database.ref('deliveryOrder/'+props.route.params.id)
        data.on('value', response=>{
          const result= response.val()
            if(!result){
              props.navigation.navigate('Delivery orders',{
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
            
              <DataTable>
              <DataTable.Header>
                    <DataTable.Cell> <Text style={{fontWeight:'700'}}>{props.route.params.orderDate}</Text></DataTable.Cell>
              </DataTable.Header>
              <DataTable.Header>
                <DataTable.Title><Text style={styles.fromText}>From</Text></DataTable.Title>
                <DataTable.Cell> <Text style={styles.fromData}>{props.route.paramsserviceType}</Text></DataTable.Cell>
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