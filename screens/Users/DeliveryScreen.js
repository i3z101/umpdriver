import React, { useState, Fragment, useEffect, useRef, useCallback } from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView, Alert} from 'react-native'
import Color from '../../constants/Color';
import {Picker} from '@react-native-community/picker';
import {Formik} from 'formik'
import {TextInput, Button, DataTable, Dialog} from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { addDeliveryOrder, addOrderToHistory, cancelDeliveryOrder, orderCancelationHandler } from '../../store/actions/actions';
import RBSheet from "react-native-raw-bottom-sheet";
import LottieView from 'lottie-react-native';
import * as yup from 'yup'
import {AntDesign, FontAwesome5, Ionicons,FontAwesome} from '@expo/vector-icons';
import { database } from '../../configDB';
import {findDriver} from '../../store/actions/actions'
import {Avatar} from 'react-native-elements'
import DialogDriver from '../../component/DialogDriver'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'


const validationSchema= yup.object({
    description: yup.string().required().min(3),
    address: yup.string().required().min(3),
    googleMapUrl: yup.string().notRequired()
})

let delivery;
let userId;
let profile;
let orderId=null;
const DeliveryScreen= props=>{
    
    //declares variables
    let modal;
    let timer=null;
    userId= useSelector(state=>state.auth.userId)
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
    const [showTimeString,setShowTimeString]= useState(false)
    const [showGoogleMap, setShowGoogleMap]=useState(false)
    const [disabledWrite,setDisabledWrite]=useState(false)
    const dispatch= useDispatch()
    const [autoPlay,setHeight]=useState(0)
    const [showDriverFound, setShowDriverFound]= useState(false)
    const bottomShow= useRef(RBSheet)
    const [placeOrder, setPlaceOrder]=useState(false)
    const [showDriverInfoButton, setShowDriverInfoButton]=useState(false)
    const [disabledCancelButton, setDisabledCancelButton]=useState(false)
    const [confirmCancel, setConfirmCancel]= useState(false)
    const [confirmCancelBeforeAccept, setConfirmCancelBeforeAccept]= useState(false)
    const [completedOrder, setCompletedOrder]= useState(false)
    delivery= useSelector(state=>state.delivery.deliveryOrder)
    profile=  useSelector(state=>state.auth.userProfile);
    const [driverInfo,setDriveInfo]= useState({
        driverName: '',
        driverCarName: '',
        driverCarModel: '',
        driverLicensePlate: '',
        driverCarColor:'',
        driverphoneNumber:''
    })


   

    
    
    
   
    //declares functions
    
   

    const getData= async()=>{    
          try{
              if(delivery.id){
                  
              }
                const data= database.ref('deliveryOrder/'+delivery.id)
                data.on('value', (res)=>{
                    const response= res.val()
                    if(response){
                        if(!response.findDriver){
                            setPlaceOrder(true)
                            timer=  setTimeout(()=>{
                                if(!response.findDriver){
                                    Alert.alert("Sorry", "We couldn't find a driver for you", [{text:'okey', onPress:()=>{
                                        setPlaceOrder(false)
                                        setShowDriverInfoButton(false)
                                        data.remove(()=>{
                                            setShowDriverFound(false)
                                            dispatch(findDriver())
                                        })
                                    }}])
                                }
                        },180000)
                        }
                        if(response.findDriver){
                            setDriveInfo({
                                driverName: response.driverDetails.driverName,
                                driverCarName: response.driverDetails.driverCarName,
                                driverCarModel: response.driverDetails.driverCarModel,
                                driverLicensePlate: response.driverDetails.driverLicensePlate,
                                driverCarColor:response.driverDetails.driverCarColor,
                                driverphoneNumber:response.driverDetails.driverphoneNumber,
                            })
                            if(response.completed){
                                setShowDriverFound(false)
                                setShowDriverInfoButton(false)
                                dispatch(findDriver())
                            }
                            orderId= res.key;
                            setShowDriverFound(true)
                            setShowDriverInfoButton(true)
                            clearTimeout(timer)
                            timer= null;
                            // bottomShow.current.close()
                        }
                        if(response.completed){
                            dispatch(findDriver())
                            setShowDriverInfoButton(false)
                            setShowDriverFound(false)
                            setPlaceOrder(false)
                            setCompletedOrder(true)
                            setDisabledCancelButton(false)
                            clearTimeout(timer)
                            timer= null;
                            addToHistory(response)
                            data.remove()
                        }
                    }else{
                        clearTimeout(timer)
                        timer= null;
                    }
                })
                

            }catch(err){
                console.log(err);
            }
        

    }

    useEffect(()=>{
        getData()
    },[])
    

    

    const onChange = (event, date) => {
        const currentDate = date||timeValue;
        setShowTime(Platform.OS === 'ios');
        setShowTimeString(true)
        setTimeValue(currentDate);
        setTimeDeliveryValue(moment(currentDate).format('hh:mm a'))
      };

      const deliveryOrderHandler= async(description,address, googleMapUrl)=>{
            const orderDate= moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");
            await dispatch(addDeliveryOrder(orderDate,profile.fullName,selectedService, description, address,googleMapUrl,timeDeliveryValue, profile.phoneNumber))
            if(delivery!==null){
            setTimeout(()=>{
            setPlaceOrder(true)
            setDisabledWrite(true)
            setHeight(450)
            bottomShow.current.open()
            getData()
            },100)
            }
            
            
           
      }

      //AFTER DRIVER ACCEPTS ORDER
      const cancelOrderHandler=(id)=>{ 
          console.log(id);
          dispatch(cancelDeliveryOrder(id))
          setConfirmCancel(false)
          setShowDriverFound(false)
          setPlaceOrder(false)
          setDisabledWrite(false)
          setShowDriverInfoButton(false)
          dispatch(findDriver())
          setHeight(0)
    
      }

      //BEFORE DRIVER ACCEPTS ORDER
      const orderCancelation=(id)=>{
          dispatch(orderCancelationHandler(id))
          setPlaceOrder(false)
          setDisabledWrite(false)
          setConfirmCancelBeforeAccept(false)
      }

      const addToHistory= async(deliveryOrder,deliveryId)=>{
           await database.ref('ordersHistory/deliveryOrder/'+userId).push(deliveryOrder)
      }



    //   const addOrderToHistory= (deliveryId, userId)=>{
    //     database.ref('deliveryOrderHistory/'+userId).push()
    //   }





      if(delivery){
         
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
           
            {Platform.OS==='ios'?<LottieView source={require('../../assets/UI/checkMark.json')} autoPlay={true} loop={true}/>:<AntDesign name="checkcircleo" size={50} color={Color.lightBlue} />}
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
                   <DataTable.Cell ><Text style={{fontWeight:'500'}}>{delivery.serviceType}</Text></DataTable.Cell>
                   <DataTable.Cell > <Text style={{ fontWeight:'500', fontSize: delivery.address&&delivery.address.length>16?9:null}}>{delivery.address?delivery.address:null}</Text></DataTable.Cell>
                   <DataTable.Cell numeric> <Text style={{ fontWeight:'500'}} >{delivery.time}</Text></DataTable.Cell>
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
              }} onPress={()=>bottomShow.current.close()}
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
    onSubmit={(values)=>{
        deliveryOrderHandler(values.description,values.address, values.googleMapUrl)
    }}
    validationSchema={validationSchema}
    validateOnBlur={true}
    >
    {(formikProps)=>(
        <ScrollView
        contentContainerStyle={{
           justifyContent:'center',
        }}
        keyboardShouldPersistTaps='handled'
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
                        <Ionicons name={Platform.OS==='android'?'md-arrow-down':'ios-arrow-down'} size={25}/>
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
                            <Ionicons name={Platform.OS==='android'?'md-arrow-down':'ios-arrow-down'} size={25}/>
                        </View>
                    </Touchable>}
             </View>
             <View style={styles.errorSchema}>
             <Text style={styles.error}>{formikProps.errors.googleMapUrl}</Text>
            </View>
              </View>
            <View style={styles.formTime}>
            {showTime? <DateTimePicker
                    display={'clock'}
                    mode='time'
                    value={timeValue}
                    is24Hour={true}
                    onChange={onChange}
                    textColor={Color.lightBlue}
                    onPre
                    
                /> : <Touchable onPress={()=>setShowTime(true)}>
                    <View style={styles.pickerButton} >
                        <Text>Select the expected time: </Text>
                        <Ionicons name={Platform.OS==='android'?'md-arrow-down':'ios-arrow-down'} size={25}/>
                    </View>
                </Touchable>}
                {Platform.OS==='android'&& showTimeString && <View style={styles.pickerButtonText}>
                        <Text style={{color:Color.lightBlue}}>{new Date(timeValue).toLocaleTimeString()}</Text>
                    </View>}
            </View>

            <View style={styles.butonContainer}>
                <Button
                disabled={placeOrder?true:false}
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
                disabled={placeOrder?false:true}
                children={showDriverInfoButton?'driver Info':'cancel'}
                mode='contained'
                onPress={showDriverInfoButton? ()=>{
                    setShowDriverFound(true)
                    setDisabledCancelButton(true)
                }:()=>setConfirmCancelBeforeAccept(true) }
                style={styles.button}
                theme={{ 
                    colors:{
                        primary:showDriverInfoButton?Color.lightBlue:'tomato'
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
   
    <DialogDriver visible={showDriverFound} 
    driverName={driverInfo.driverName} 
    driverCarName={driverInfo.driverCarName}
    driverCarModel={driverInfo.driverCarModel}
    driverCarColor={driverInfo.driverCarColor}
    driverLicensePlate={driverInfo.driverLicensePlate}
    driverPhoneNumber={driverInfo.driverphoneNumber}
    cannotCancel={disabledCancelButton}
    source={require('../../assets/favicon.png')}
    onPressCancel={()=>{
        //setShowDriverFound(false)
        setConfirmCancel(true)
    }}
    onPressAwesome={()=>{
        setShowDriverFound(false)
        bottomShow.current.close()
        // dispatch(findDriver())
    }}
    />

        {confirmCancel&&<Dialog visible={confirmCancel}>
                <Dialog.Title style={{textAlign:'center'}}>
                    <Text>Are you sure to cancel the order?</Text>
                </Dialog.Title>
                <Dialog.Actions style={{justifyContent:'space-around'}}>
                    <Button mode='outlined' children="No, I'm kidding" color={Color.lightBlue} onPress={()=>setConfirmCancel(false)}/>
                    <Button mode='contained' children="Yes, i'm sure" color={'#ff3333'} onPress={()=>cancelOrderHandler(delivery.id)}/>
                </Dialog.Actions>
            </Dialog>}


        {confirmCancelBeforeAccept&&<Dialog visible={confirmCancelBeforeAccept}>
        <Dialog.Title style={{textAlign:'center'}}>
            <Text>Are you sure to cancel the order?</Text>
        </Dialog.Title>
        <Dialog.Actions style={{justifyContent:'space-around'}}>
            <Button mode='outlined' children="No, I'm kidding" color={Color.lightBlue} onPress={()=>setConfirmCancelBeforeAccept(false)}/>
            <Button mode='contained' children="Yes, i'm sure" color={'#ff3333'} onPress={()=>orderCancelation(delivery.id)}/>
        </Dialog.Actions>
    </Dialog>}

    {completedOrder&&<Dialog visible={completedOrder}>
        <Dialog.Content>
            {Platform.OS==='ios'? <LottieView source={require('../../assets/UI/happyFace.json')} autoPlay={true} loop={true} style={{width:'70%', alignSelf:'center'}}/>:<FontAwesome name="hand-peace-o" size={50} color={Color.lightBlue} style={{alignSelf:'center'}}/>}
        </Dialog.Content>
        <Dialog.Title style={{textAlign:'center', marginTop:Platform.OS==='ios'?'-15%':0}}>
            <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>WOOW,YOU'VE COMPLETED YOUR ORDER</Text>
        </Dialog.Title>
        <Dialog.Content style={{width:'80%', alignSelf:'center'}}>
            <Button mode='contained' children="Great!!" color={Color.lightBlue} onPress={()=>setCompletedOrder(false)}/>
        </Dialog.Content>
    </Dialog>}

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
    formTime:{
        padding:Platform.OS==='android'? 10: 10,
        marginBottom:Platform.OS==='android'?15:10
    },
    pickerStyle:{
        width:'100%',
    },
    pickerButton:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    pickerButtonText:{
        alignSelf:'center',
        marginTop:5
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
    },
    driverInfoButton:{
        width:'50%', 
        position:'absolute', 
        top:Platform.OS==='ios'?'90%':'95%', 
        left:'50%'
    }
  
    
})

export const DeliveryOptionStyle= navData=>{
    return{
       headerTintColor: Color.Second,
       cardStyle:{
           backgroundColor:Color.white
       },
       gestureEnabled:false,
       headerLeft:null,
       headerTitleAlign:'center',
       
    }
}




export default DeliveryScreen
