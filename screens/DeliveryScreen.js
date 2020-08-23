import React, { useState, Fragment, useEffect, useRef, forwardRef } from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView, FlatList} from 'react-native'
import Color from '../constants/Color';
import {Picker} from '@react-native-community/picker';
import Card from '../component/Card';
import {Formik} from 'formik'
import * as yup from 'yup'
import { TextInput, Button } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { addDeliveryOrder } from '../store/actions/addAction';
import { Modalize } from 'react-native-modalize';
import Modal from 'react-native-modal'

const DeliveryScreen= props=>{
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

    const deliveryinfo= useSelector(state=>state.delivery.delivery)
    const driverInfo= useSelector(state=>state.delivery.driver)
    const dispatch= useDispatch()
    const[showModal, setShowModal]=useState(false)
    const showModalize= useRef(Modalize)
    // useEffect(()=>{
    //     console.log(data);
    // },[data])

    const onChange = (event, date) => {
        const currentDate = date||timeValue;
        setTimeValue(currentDate);
        setTimeDeliveryValue(moment(currentDate).format('hh:mm a'))
      };

      const deliveryOrderHandler= (description,address, googleMapUrl)=>{
        
         dispatch(addDeliveryOrder(selectedService, description, address,googleMapUrl,timeDeliveryValue))
         setShowModal(true)
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
                  
                {showPicker? <Picker
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
                children='cancel'
                mode='contained'
                onPress={()=>props.navigation.goBack()}
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
    {deliveryinfo.length!==0?
        <Modal
        isVisible={showModal}
        animationIn='slideInUp'
        style={{
            backgroundColor:Color.white,
        
        }}
        coverScreen={false}
        deviceHeight={Dimensions.get('window').width/2}
        >
       
        <View style={{flex:1, borderBottomWidth:1,}}>
        <View style={{alignItems:'center', borderWidth:1, padding:10, margin:15, backgroundColor:Color.Primary}}>
        <Text style={{color:Color.white}}>ORDER SUMMARY</Text>
        </View>
            <View style={styles.containerModal}>
            <Text style={styles.textTitle}>FROM:</Text>
            <Text>{deliveryinfo[deliveryinfo.length-1].serviceType}</Text>
            </View>
            <View style={styles.containerModal}>
            <Text style={styles.textTitle}>TO:</Text>
            <Text>{deliveryinfo[deliveryinfo.length-1].address}</Text>
            </View>
            <View style={styles.containerModal}>
            <Text style={styles.textTitle}>DESC:</Text>
            <Text>{deliveryinfo[deliveryinfo.length-1].description}</Text>
            </View>
            <View style={styles.containerModal}>
            <Text style={styles.textTitle}>TIME:</Text>
            <Text>{deliveryinfo[deliveryinfo.length-1].time}</Text>
            </View>
        </View>
        <View style={{alignItems:'center', borderWidth:1, padding:10, margin:15, backgroundColor:Color.Primary}}>
        <Text style={{color:Color.white}}>DRIVER INFORMATION</Text>
        </View>
        <View style={{...styles.containerModal, width:'104%'}}>
        <Text style={styles.textTitle}>NAME:</Text>
        <Text>{driverInfo[driverInfo.length-1].driverName}</Text>
        </View>
        <View style={styles.containerModal}>
        <Text style={styles.textTitle}>CAR NAME:</Text>
        <Text>{driverInfo[driverInfo.length-1].driverCar}</Text>
        </View>
        <View style={styles.containerModal}>
        <Text style={styles.textTitle}>CAR MODEL:</Text>
        <Text>{driverInfo[driverInfo.length-1].driverCarModel}</Text>
        </View>
        <View style={styles.containerModal}>
        <Text style={styles.textTitle}>CAR COLOR:</Text>
        <Text>{driverInfo[driverInfo.length-1].driverCarColor}</Text>
        </View>
        
        <Button children="close" onPress={()=>setShowModal(false)}/>
        
        </Modal>
        : null
    }
     
       
  
   
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
   containerModal:{
    justifyContent:'space-evenly', flexDirection:'row', marginVertical:8.5, borderBottomEndRadius:10
   },
   textTitle:{
       fontSize:16,
       fontWeight:'bold'
   }
    
})

export const DeliveryOptionStyle= navData=>{
    return{
       headerTintColor: Color.Second,
       cardStyle:{
           backgroundColor:Color.white
       }
    }
}

export default DeliveryScreen
