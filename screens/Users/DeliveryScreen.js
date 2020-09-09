import React, { useState, Fragment, useEffect, useRef } from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView, FlatList, Animated, Easing } from 'react-native'
import Color from '../../constants/Color';
import {Picker} from '@react-native-community/picker';
import {Formik} from 'formik'
import {TextInput, Button, DataTable} from 'react-native-paper'
import {Ionicons} from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { addDeliveryOrder, cancelOrder } from '../../store/actions/actions';
import RBSheet from "react-native-raw-bottom-sheet";
import LottieView from 'lottie-react-native';
import * as yup from 'yup'


const validationSchema= yup.object({
    description: yup.string().required().min(3),
    address: yup.string().required().min(3),
    googleMapUrl: yup.string().notRequired()
})

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
    const [autoPlay,setHeight]=useState(0)
    // const bottomShow= useRef(null)
    const bottomShow= useRef(RBSheet)
  

    // useEffect(()=>{
    //     props.navigation.dispatch(
    //         CommonActions.reset()
    //     )
    // },[])
    
    let modal;

    

    

    


    

    const onChange = (event, date) => {
        const currentDate = date||timeValue;
        setTimeValue(currentDate);
        setTimeDeliveryValue(moment(currentDate).format('hh:mm a'))
      };

      const deliveryOrderHandler= async(description,address, googleMapUrl)=>{

       
         await dispatch(addDeliveryOrder(selectedService, description, address,googleMapUrl,timeDeliveryValue))
        
        //  setShowModal(true)
        setDisabledWrite(true)
        setHeight(450)
        bottomShow.current.open()
      }

      const cancelOrderHandler=(id)=>{
          dispatch(cancelOrder(id))
          
        setHeight(0)
        // bottomShow.current.close()
      }


      if(delivery.length>0){
        modal= (
            
           <RBSheet
           animationType='slide'
           ref={bottomShow}
           height={450}
           openDuration={250}
           customStyles={{
             container: {
               justifyContent: "center",
               alignItems: "center"
             },
             wrapper: {
                backgroundColor: "transparent",

              },
              draggableIcon: {
                backgroundColor: Color.Primary
              }
           }}
           closeOnPressMask={false}
           children={
               <Fragment>
            <View style={{
                justifyContent:'center',
                alignItems:'center',
                width:Dimensions.get('window').height > 600 ? '30%' : '25%',
                height:Dimensions.get('window').height > 600 ? '30%' : '25%',
                marginVertical:7
            }}>
           
            <LottieView
            source={require('../../assets/UI/checkMark.json')}
            autoPlay={true}
            loop={true}
            />
            </View>
            <View >
               <Text style={{alignItems:'center', alignSelf:'center', fontSize:17, fontWeight:'500', marginVertical:15}}>Your order has been placed </Text>
               <View >
                  <DataTable >
                    <DataTable.Header>
                    <DataTable.Title nu><Text>FROM</Text></DataTable.Title>
                    <DataTable.Title><Text>TO</Text></DataTable.Title>
                    <DataTable.Title numeric><Text>TIME</Text></DataTable.Title>
                    </DataTable.Header>
                   <DataTable.Row>
                   <DataTable.Cell ><Text style={{fontWeight:'500'}}>{delivery[0].serviceType}</Text></DataTable.Cell>
                   <DataTable.Cell > <Text style={{ fontWeight:'500', fontSize:delivery[0].address.length>16?9:null}}>{delivery[0].address}</Text></DataTable.Cell>
                   <DataTable.Cell numeric> <Text style={{ fontWeight:'500'}} >{delivery[0].time}</Text></DataTable.Cell>
                   </DataTable.Row>
                  </DataTable>
               </View>
               <View style={{flexDirection:'row', justifyContent:'space-between',marginVertical:20, marginTop:15}}>

                  
               </View>
               <View style={{marginVertical:10}}>
               <Text style={{alignItems:'center', alignSelf:'center',fontSize:17, fontWeight:'500'}}>Driver will be found and call you soon...  
               <Ionicons name={Platform.OS==='android'? 'md-happy':'ios-happy'} color={Color.lightBlue} size={20} /><Ionicons/></Text>
               </View>
               
            </View>
            <View >
             <Button children='ALRIGHT:)' mode='contained' theme={{ 
                  colors:{
                      background:Color.white,
                      primary:Color.lightBlue
                  },
                  roundness:10
              }} onPress={()=>cancelOrderHandler(delivery[0].id)}
              style={{padding:2}}
              />
            </View>
            </Fragment>
            }
           />
           
         
          
        )
    }else{
        modal=null
    }


    return <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
   
    <KeyboardAvoidingView behavior={Platform.OS=='android'?'height':'padding'} style={styles.container} keyboardVerticalOffset={115} >
    
    <Formik 
    initialValues={{
        description:'',
        address:'',
        googleMapUrl:''
    }}
    onSubmit={(values)=>deliveryOrderHandler(values.description,values.address, values.googleMapUrl)}
    validationSchema={validationSchema}
    validateOnBlur={true}
    >
    {(formikProps)=>(
        <ScrollView
        contentContainerStyle={{
           justifyContent:'center',
        }}
        >
        <View style={styles.formContainer}>
       
            <View style={styles.form}>
                  
                {showPicker ? <Picker
                    
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
                multiline
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
                onBlur={formikProps.handleBlur('description')}
                />
           </View>
           <View style={styles.errorSchema}>
            <Text style={styles.error}>{formikProps.touched.description&&formikProps.errors.description}</Text>
           </View>
            </View>
            
            <View style={styles.form}>
            <View style={styles.inputContainer}>
                 <TextInput
                maxLength={21}
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
                 onBlur={formikProps.handleBlur('address')}
                 />
            </View>
           
            <View style={styles.errorSchema}>
            
            <Text style={styles.error}>{formikProps.touched.address&&formikProps.errors.address}</Text>
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
             <View style={styles.errorSchema}>
             <Text style={styles.error}>{formikProps.errors.googleMapUrl}</Text>
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
                        <Text>Select the expected time: </Text>
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
                // disabled={bottomShow.current?true:false}
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
    errorSchema:{
        alignItems:'center'
    },
    error:{
        color:'red'
    }
  
    
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
