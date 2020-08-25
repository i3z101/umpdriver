import React, { useState, Fragment, useEffect, useRef, forwardRef } from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView, FlatList} from 'react-native'
import Color from '../constants/Color';
import {Picker} from '@react-native-community/picker';
import Card from '../component/Card';
import {Formik} from 'formik'
import {TextInput, Button} from 'react-native-paper'
import Modal from 'react-native-modal'

import {Ionicons} from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { addDeliveryOrder, cancelOrder } from '../store/actions/actions';
import {CommonActions} from '@react-navigation/native'
import { Modalize } from 'react-native-modalize';
import DriverInfo from '../component/DriverInfo';
import ModalItem from '../component/ModalItem';
import BottomSheet from 'reanimated-bottom-sheet';
import RBSheet from "react-native-raw-bottom-sheet";


const DeliveryScreen= props=>{
    let id;

    if(props.route.params?.id){
        id=props.route.params?.id
    }

    let Touchable;
    if(Platform.OS==='android'){
        Touchable= TouchableWithoutFeedback
    }
    else{
        Touchable= TouchableOpacity
    }
    const [selectedService, setSelectedService]=useState('UMP') 
    const [showPicker, setShowPicker]= useState(false)
    const [timeValue, setTimeValue]=useState(new Date())
    const [timeDeliveryValue, setTimeDeliveryValue]=useState(null)
    const [showTime, setShowTime]= useState(false)
    const [showGoogleMap, setShowGoogleMap]=useState(false)
    const [disabledWrite,setDisabledWrite]=useState(false)
    const delivery= useSelector(state=>state.delivery.deliveryOrder)
    const driverInfo= useSelector(state=>state.delivery.driver)
    const dispatch= useDispatch()
    const[showModal, setShowModal]=useState(false)
    // const bottomShow= useRef(null)
    const bottomShow= useRef(RBSheet)
  

    // useEffect(()=>{
    //     props.navigation.dispatch(
    //         CommonActions.reset()
    //     )
    // },[])
    
    let modal;

    if(delivery.length>0){
        modal= (
            
           <RBSheet
           animationType='slide'
           ref={bottomShow}
           height={300}
           openDuration={250}
           customStyles={{
             container: {
               justifyContent: "center",
               alignItems: "center"
             },
             wrapper: {
                backgroundColor: "transparent"
              },
              draggableIcon: {
                backgroundColor: Color.Primary
              }
           }}
           closeOnPressMask={false}
           >
          <FlatList
                contentContainerStyle={{backgroundColor:Color.white}}
                data={delivery}
                renderItem={itemData=><ModalItem
                       serviceType={itemData.item.serviceType}
                       address={itemData.item.address}
                       time={itemData.item.time}
                       onPress={()=>cancelOrderHandler(itemData.item.id)}
                       driverName={driverInfo[0].driverName}
                       carName={driverInfo[0].driverCar}
                       driverCarModel={driverInfo[0].driverCarModel}
                       driverCarColor={driverInfo[0].driverCarColor}
                   />}
                />
         
           </RBSheet>
        )
    }else{
        modal=null
    }

    

    


    

    const onChange = (event, date) => {
        const currentDate = date||timeValue;
        setTimeValue(currentDate);
        setTimeDeliveryValue(moment(currentDate).format('hh:mm a'))
      };

      const deliveryOrderHandler= (description,address, googleMapUrl)=>{

       
         dispatch(addDeliveryOrder(selectedService, description, address,googleMapUrl,timeDeliveryValue))
        //  setShowModal(true)
        setDisabledWrite(true)
        bottomShow.current.open()
      }

      const cancelOrderHandler=(id)=>{
          dispatch(cancelOrder(id))
        //   setShowModal(false)
        bottomShow.current.close()
      }

    return <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
   
    <KeyboardAvoidingView behavior={Platform.OS=='android'?'height':'padding'} style={styles.container} keyboardVerticalOffset={150} >
    
    <Formik 
    initialValues={{
        description:'',
        address:'',
        googleMapUrl:''
    }}
    onSubmit={(values)=>deliveryOrderHandler(values.description,values.address, values.googleMapUrl)}
    >
    {(formikProps)=>(
        <ScrollView
        contentContainerStyle={{
           justifyContent:'center',
        }}
        >
        <View style={styles.formContainer}>
       
            <View style={styles.form}>
                  
                {showPicker && !bottomShow.current? <Picker
                    
                selectedValue={selectedService}
                onValueChange={(itemValue, index)=>setSelectedService(itemValue)}
                style={styles.pickerStyle}
                itemStyle={{
                    color:Color.lightBlue
                }}
                >
                <Picker.Item label='UMP' value='UMP'/>
                <Picker.Item label='TMG' value='TMG'/>
                <Picker.Item label='NIRWANA' value='NIRWANA'/>
                </Picker> : <Touchable onPress={()=>setShowPicker(true)}>
                    <View style={styles.pickerButton} >
                        <Text>Select a service: </Text>
                        <Ionicons name={Platform.OS==='android'?'md--arrow-down':'ios-arrow-down'} size={25}/>
                    </View>
                </Touchable>}
            </View>
            <View style={styles.textInput}>
            <View style={styles.form}>
           <View style={styles.inputContainer}>
                <TextInput
                disabled={disabledWrite}
                label='description of the order'
                mode='outlined'
                theme={{
                    colors:{
                        primary:Color.lightBlue
            
                    },
                animation:{
                    scale:0.5
                }
                }}
                value={formikProps.values.description}
                onChangeText={formikProps.handleChange('description')}
                />
           </View>
            </View>
            
            <View style={styles.form}>
            <View style={styles.inputContainer}>
                 <TextInput
                 disabled={disabledWrite}
                 label='Address'
                 mode='outlined'
                 theme={{
                     colors:{
                         primary:Color.lightBlue
             
                     },
                 }}
                 value={formikProps.values.address}
                 onChangeText={formikProps.handleChange('address')}
                 textContentType='addressCityAndState'
                 placeholder='eg.KK4'
                 />
            </View>
             </View>
             </View>
             <View style={styles.form}>
             <View style={styles.inputContainer}>
                 {showGoogleMap? <TextInput
                    disabled={disabledWrite}
                  label='google map'
                  mode='outlined'
                  theme={{
                      colors:{
                          primary:Color.lightBlue
              
                      },
                  }}
                  value={formikProps.values.googleMapUrl}
                  onChangeText={formikProps.handleChange('googleMapUrl')}
                  textContentType='URL'
                  keyboardType='url'
                  onEndEditing={()=>{
                      if(formikProps.values.googleMapUrl==''){
                          setShowGoogleMap(false)
                      }
                  }}
                  /> : <Touchable onPress={()=>setShowGoogleMap(true)}>
                        <View style={styles.pickerButton} >
                            <Text>Oustside the campus? insert google map address</Text>
                            <Ionicons name={Platform.OS==='android'?'md--arrow-down':'ios-arrow-down'} size={25}/>
                        </View>
                    </Touchable>}
             </View>
              </View>
            <View style={styles.form}>
            {showTime? <DateTimePicker
                    display='default'
                    value={timeValue}
                    mode='time'
                    is24Hour={true}
                    onChange={onChange}
                    textColor={Color.lightBlue}
                    
                /> : <Touchable onPress={()=>setShowTime(true)}>
                    <View style={styles.pickerButton} >
                        <Text>Select a time you are free: </Text>
                        <Ionicons name={Platform.OS==='android'?'md--arrow-down':'ios-arrow-down'} size={25}/>
                    </View>
                </Touchable>}
            </View>

            <View style={styles.butonContainer}>
                <Button
                // disabled={bottomShow.current?true:false}
                children='place order'
                mode='contained'
                onPress={()=>formikProps.handleSubmit()}
                style={styles.button}
                theme={{
                    colors:{
                        primary:Color.Primary
                    },
                    roundness:20
                }}
                />
                <Button
                disabled={bottomShow.current?true:false}
                children='cancel'
                mode='contained'
                onPress={()=>{
                    props.navigation.goBack()
                    cancelOrderHandler()
                }}
                style={styles.button}
                theme={{
                    colors:{
                        primary:'tomato'
                    },
                    roundness:20
                }}
                />
            </View>
            
        </View>
        </ScrollView>
    )}
    
    </Formik>
   
    {modal}
    
    
       
    
       
    
       
  
   
    </KeyboardAvoidingView>
    
    </TouchableWithoutFeedback>
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        marginVertical: Dimensions.get('window').height/30,
        backgroundColor:Color.white
    },
    formContainer:{
        width:'100%',
        flex:1
        
    },
    form:{
        padding:10,
        
    },
    pickerStyle:{
        width:'100%',
    },
    pickerButton:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    butonContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:5,
    },
    button:{
        padding:2.5
    },
   orderContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginVertical:10,
        padding:10,

    },
  
    
})

export const DeliveryOptionStyle= navData=>{
    return{
       headerTintColor: Color.Second,
       cardStyle:{
           backgroundColor:Color.white
       },
       gestureEnabled:false,
       headerLeft:null
    }
}

export default DeliveryScreen
