import React, { useState, useEffect, useRef } from 'react'
import {View, StyleSheet, Platform, TouchableOpacity, Alert, Dimensions, Modal} from 'react-native'
import MapView, {Marker, Callout, Polyline} from 'react-native-maps'
import Color from '../constants/Color'
import { MaterialIcons,AntDesign, Ionicons, FontAwesome} from '@expo/vector-icons';
import vars from '../helper' 
import GoogleAC from '../modal/autoComplete-class'
import {Text, Button, DataTable, Dialog} from 'react-native-paper'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import {Modalize} from 'react-native-modalize'
import MapViewDirections from 'react-native-maps-directions'
import { useDispatch, useSelector } from 'react-redux';
import { findDriver, pickUpOrder, cancelPickupOrder } from '../store/actions/actions';
import  moment from 'moment'
import LottieView from 'lottie-react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import {database} from '../configDB'
import {Avatar} from 'react-native-elements'
import DialogDriver from './DialogDriver';


let pickupOrder
let mount=false
let timer;
let userId;
let profile;
const MapPreview= props=>{
    
    pickupOrder=useSelector(state=>state.pickUp.pickUpOrder)
    userId= useSelector(state=>state.auth.userId)
    profile= useSelector(state=>state.auth.userProfile);
    const getCurrentLocation= async()=>{
        const status= await Location.requestPermissionsAsync()
        if(status.status!=='granted'){
            Alert.alert("WRONG", "OPEN LOCATION SETTING", [{text:"OKAY"}])
        }
        const response= await Location.getCurrentPositionAsync()
        setCurrentPosition({
            lat: response.coords.latitude,
            lng: response.coords.longitude
        })
    }

    useEffect(()=>{
        mount=true
        if(mount){
            getCurrentLocation()
        }
       return ()=>mount=false
    },[])

   
  

    
    const [currentPosition, setCurrentPosition]= useState({
        lat:null,
        lng:null
    })

    const [destinationDetails, setDestinationDetails]= useState({
        name:'',
        lat:null,
        lng:null,
        destination:null,
        duration:null,
        fullPrice:null,
    })

    const [searchPlace, setSearchPlace]= useState('')
    const [autoCompletePlacesArray, setAutoCompletePlaces]= useState([])
     pickupOrder= useSelector(state=>state.pickUp.pickUpOrder)
    const [showPlaceDetails, setShowPlaceDetails]= useState(false)
    const [driverFound, setDriverFound]= useState(false)
    const btmSheet= useRef(Modalize)
    const [showDriverDetails, setShowDriverDetails]= useState(false)
    const driverDetails= useRef()
    const [showDriverInfoButton, setShowDriverInfoButton]=useState(false)
    const dispatch= useDispatch()
    const [confirmCancel, setConfirmCancel]= useState(false)
    const [completedOrder, setCompletedOrder]= useState(false)
    const [driverInfo,setDriveInfo]= useState({
        driverName: '',
        driverCarName: '',
        driverCarModel: '',
        driverLicensePlate: '',
        driverCarColor:'',
        driverphoneNumber:''
    })
    

    const width= Dimensions.get('window').width
    const height= Dimensions.get('window').height
    const aspectRatio= width/height

    let markCurrentPositionConfig;
    let markDestinationConfig

    let Touch= TouchableOpacity

    if(Platform.OS==='android'){
        Touch= TouchableWithoutFeedback
    }

    

    
    




    const directionDestination= async(description, details)=>{

        try{
            const data= await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentPosition.lat},${currentPosition.lng}&destination=${details.lat},${details.lng}&key=${vars.googleApiKey}`)
        if(!data.ok){
            throw new Error("ERROR IN THE REQUEST")
        }
        const response= await data.json()
        const distance= response.routes[0].legs[0].distance.text;
        const duration= response.routes[0].legs[0].duration.text;

        const destinationKm= parseFloat(distance)
        let startDestinationPrice=0;
        let destinationsubPricee=0;
        let destinationFullPrice=0
        
        if(destinationKm>=1&&destinationKm<=10){
            startDestinationPrice= 1.6;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=11&&destinationKm<=19){
            startDestinationPrice= 1.5;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=20&&destinationKm<=25){
            startDestinationPrice= 1.3;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>26&&destinationKm<=30){
            startDestinationPrice= 1.3;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=30&&destinationKm<=35){
            startDestinationPrice= 1.2;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=36&&destinationKm<=40){
            startDestinationPrice= 1.1;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=40&&destinationKm<=55){
            startDestinationPrice= 0.9;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=56&&destinationKm<=70){
            startDestinationPrice= 0.7;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else if(destinationKm>=71&&destinationKm<=90){
            startDestinationPrice= 0.5;
            destinationsubPricee= destinationKm / startDestinationPrice;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }else{
            startDestinationPrice= 0;
            destinationsubPricee= 0;
            destinationFullPrice= Math.floor(destinationsubPricee)
        }

        setDestinationDetails({
            name:description.length>80?description.split(',').shift():description,
            lat:details.lat, 
            lng:details.lng,
            destination:distance,
            duration:duration,
            fullPrice: destinationFullPrice,
        })

       
       setShowPlaceDetails(true)
     
       setTimeout(() => {
        btmSheet.current.open()
       }, 100);
       
       
    }catch(err){
        console.log(err);
        throw err
    }
      
    }



    

    
    
    const getData= async()=>{

        try{
                const data= database.ref('pickUpOrder/'+pickupOrder.id)
                data.on('value', (res)=>{
                const response= res.val()
                if(response){
                        if(!response.findDriver){
                            timer= setTimeout(()=>{
                                if(!response.findDriver){
                                    Alert.alert("Sorry", "We couldn't find a driver for you", [{text:'okey', onPress:()=>{
                                        data.remove(()=>{
                                            //driverDetails.current.close()
                                            setDriverFound(false);
                                            setShowDriverInfoButton(false)
                                            setShowDriverDetails(false)
                                            clearTimeout(timer)
                                            timer=null
                                            //dispatch(findDriver())
                                            btmSheet.current.close();
                                        })
                                    }}])
                                }
                            
                    }, 180000)
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
                            setDriverFound(false)
                            setShowDriverInfoButton(false)
                        }
                        setDriverFound(true)
                        setShowDriverInfoButton(true)
                        driverDetails.current.close()    
                        clearTimeout(timer)
                        timer= null;
                        if(response.completed){
                            setShowDriverInfoButton(false)
                            setDriverFound(false)
                            setCompletedOrder(true)
                            addToHistory(response,pickupOrder.id)
                            addToHistory(response)
                            data.remove()
                        }
                    }        
                }
            })

            

           

        }catch(err){
            console.log(err);
        }
    }
    
    


    let mapConfig={
        latitude: currentPosition.lat? currentPosition.lat : 3.822210,
        longitude: currentPosition.lng? currentPosition.lng :103.335450,
        latitudeDelta:0.0922,
        longitudeDelta:0.0922 * aspectRatio
    }

    const pickPlace= event=>{
       setCurrentPosition({
           lat: event.nativeEvent.coordinate.latitude,
           lng:event.nativeEvent.coordinate.longitude,
       })
       
    }

    const addPickUpOrder= async(placeName, destination, arrivalTime, price)=>{
        
        const orderDate= moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");
        await dispatch(pickUpOrder(orderDate,profile.fullName,placeName, destination, arrivalTime,price, profile.phoneNumber))
        if(pickupOrder!==null){
             btmSheet.current.close()
        setShowDriverDetails(true)
        setTimeout(() => {
            driverDetails.current.open()
            getData()
           }, 500);

        }   
}

    const cancelOrderHandler=(id)=>{
        dispatch(cancelPickupOrder(id))
        setConfirmCancel(false)
        setDriverFound(false)
        setShowDriverInfoButton(false)
    }

    const addToHistory= async(pickupOrder,pickpId)=>{
        await database.ref('ordersHistory/pickupOrders/'+userId).push(pickupOrder)
    }
    

   

    if(currentPosition.lat && currentPosition.lng){
        markCurrentPositionConfig={
            latitude: currentPosition.lat,
            longitude: currentPosition.lng
        }
    }

    if(destinationDetails.lat && destinationDetails.lng){
        markDestinationConfig={
            latitude: destinationDetails.lat,
            longitude: destinationDetails.lng
        }
    }

    return <View style={styles.mapContainer}>
    <MapView style={styles.mapContainer} region={mapConfig} provider={'google'}  onPress={pickPlace} onMarkerDragEnd={pickPlace} mapType='standard'>
   
    {currentPosition.lat&&currentPosition.lng&&<Marker title='here' coordinate={markCurrentPositionConfig} pinColor={Color.Primary} />}
    
    {destinationDetails.lat&&<Marker title='here' coordinate={markDestinationConfig} pinColor={Color.Primary}/>}

    {destinationDetails.lat && destinationDetails.lng&&<MapViewDirections
        origin={{
            latitude:currentPosition.lat,
            longitude:currentPosition.lng
        }}
        destination={{
            latitude:destinationDetails.lat,
            longitude:destinationDetails.lng
        }}
        apikey={vars.googleApiKey}
        strokeWidth={6}
        strokeColor={Color.Primary}
        />}

   
  
</MapView>
<View style={{position:'absolute', width:'90%', marginTop:'12%', alignSelf:'center'}}>

<GooglePlacesAutocomplete 
    placeholder='search a place'
    placeholderTextColor={Color.Second}
    styles={{
        textInputContainer:{
            backgroundColor:'white',
            borderRadius:10,
            shadowRadius:10,
            shadowColor:Color.Second,
            shadowOpacity:0.4,
            shadowOffset:{width:1, height:5},

        },
        textInput:{
            textAlign:'center',
            padding:10
        },
        poweredContainer:{
            display:'none'
        },
        listView:{
            backgroundColor:Color.white,
            borderRadius:10,
            marginTop:1
        },
        separator:{
            borderBottomColor:Color.lightBlue,
            borderBottomWidth:1
        }   
    }}
    fetchDetails={true}
    onPress={(data, details)=>directionDestination(data.description, details.geometry.location)}
    query={{
        key: vars.googleApiKey,
        language:'en'
    }}
    debounce={20}
    

/>
</View>



<Touch style={styles.locationButonContainer} onPress={showDriverInfoButton?()=>setDriverFound(true):getCurrentLocation}>
{showDriverInfoButton?<FontAwesome name="drivers-license-o" size={30} color="black" style={{padding:12}}/>: <MaterialIcons name="my-location" size={30} color={Color.Second} style={{padding:12}}/>}
</Touch>

{driverFound&& <DialogDriver visible={driverFound} 
        driverName={driverInfo.driverName} 
        driverCarName={driverInfo.driverCarName}
        driverCarModel={driverInfo.driverCarModel}
        driverCarColor={driverInfo.driverCarColor}
        driverLicensePlate={driverInfo.driverLicensePlate}
        driverPhoneNumber={driverInfo.driverphoneNumber}
        source={require('../assets/favicon.png')}
        onPressCancel={()=>setConfirmCancel(true)}
        onPressAwesome={()=>{
            setDriverFound(false)
            btmSheet.current.close()
            dispatch(findDriver())
        }}
        />}

        {confirmCancel&&<Dialog visible={confirmCancel}>
        <Dialog.Title style={{textAlign:'center'}}>
            <Text>Are you sure to cancel the order?</Text>
        </Dialog.Title>
        <Dialog.Actions style={{justifyContent:'space-around'}}>
            <Button mode='outlined' children="No, I'm kidding" color={Color.lightBlue} onPress={()=>setConfirmCancel(false)}/>
            <Button mode='contained' children="Yes, i'm sure" color={'#ff3333'} onPress={()=>cancelOrderHandler(pickupOrder.id)}/>
        </Dialog.Actions>
    </Dialog>}

    {completedOrder&&<Dialog visible={completedOrder}>
        <Dialog.Content>
            {Platform.OS==='ios'? <LottieView source={require('../assets/UI/happyFace.json')} autoPlay={true} loop={true} style={{width:'70%', alignSelf:'center'}}/>:<FontAwesome name="hand-peace-o" size={50} color={Color.lightBlue} style={{alignSelf:'center'}}/>}
        </Dialog.Content>
        <Dialog.Title style={{textAlign:'center', marginTop:Platform.OS==='ios'?'-15%':0}}>
            <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>WOOW,YOU'VE COMPLETED YOUR ORDER</Text>
        </Dialog.Title>
        <Dialog.Content style={{width:'80%', alignSelf:'center'}}>
            <Button mode='contained' children="Great!!" color={Color.lightBlue} onPress={()=>setCompletedOrder(false)} />
        </Dialog.Content>
    </Dialog>}



{showPlaceDetails&& <Modalize
    modalStyle={{padding:'3%'}}
    ref={btmSheet}
    handlePosition='inside'
   snapPoint={355}
   modalHeight={355}
   disableScrollIfPossible={true}
    children={
        <View>
        <View style={styles.nameTextContainer}>
        <Text style={styles.nameText}>{destinationDetails.name}</Text>
        </View>
            <DataTable>
            <DataTable.Header style={{borderBottomWidth:1, borderBottomColor:Color.Second}} >
            <DataTable.Title><Text style={styles.tableHeaderText}>Destination</Text></DataTable.Title>
                <DataTable.Cell numeric><Text style={styles.tableRowText}>{destinationDetails.destination}</Text></DataTable.Cell>
            </DataTable.Header>

            <DataTable.Header style={{borderBottomWidth:1, borderBottomColor:Color.Second}} >
            <DataTable.Title ><Text style={styles.tableHeaderText}>Expected Arrival in </Text></DataTable.Title>
            <DataTable.Cell numeric><Text style={styles.tableRowText}>{destinationDetails.duration}</Text></DataTable.Cell>
            </DataTable.Header>
          
          
            <DataTable.Header style={{borderBottomWidth:0, borderBottomColor:Color.Second}} >
            <DataTable.Title><Text style={styles.tableHeaderText}>Price </Text></DataTable.Title>
            {parseFloat(destinationDetails.destination)<=90?<DataTable.Cell numeric><Text style={styles.tableRowText}>{destinationDetails.fullPrice} RM</Text></DataTable.Cell>:
            <DataTable.Cell numeric><Text style={{fontSize:14.6, fontWeight:'700', color:Color.Primary}}>Driver will contact you</Text></DataTable.Cell>}
            </DataTable.Header>

           
            </DataTable>
           </View>
      }
        closeSnapPointStraightEnabled={false}
        handleStyle={{backgroundColor:Color.lightBlue}}
        modalTopOffset={100}
        tapGestureEnabled={false}
        threshold={500}
        closeOnOverlayTap={false}
        velocity={1000}
        panGestureEnabled={false}
        panGestureComponentEnabled={true}
        FooterComponent={<View style={{marginBottom:10, flexDirection:'row', justifyContent:'space-around'}}>

    <Button children={<Text style={{color:Color.lightBlue, fontSize:16, fontWeight:'500'}}>ORDER NOW</Text>}  color={Color.lightBlue} onPress={()=>addPickUpOrder(destinationDetails.name, destinationDetails.destination, destinationDetails.duration, destinationDetails.fullPrice)}/>
    <Button children={<Text style={{color:'tomato', fontSize:16, fontWeight:'500'}}>CANCEL</Text>}  color='tomato' onPress={()=>btmSheet.current.close()}/>
    </View>}
    HeaderComponent={<View style={styles.headerComponentContainer}>
            <View style={styles.headerComponentChildren}>
                <Text style={styles.textHeader}>PLACE DETAILS</Text>
            </View>
        </View>}
/>}

{showDriverDetails&&<RBSheet
    minClosingHeight={50}
    ref={driverDetails}
    height={driverFound?350:220}
    openDuration={270}
    animationType={'slide'}
    customStyles={{
        container:{
            justifyContent:'center',
            alignItems:'center'
        },
    }}
    closeOnPressMask={false}
    closeOnPressBack={false}

    >
    {!driverFound&&<View>
    <View style={{width:120, height:120, alignSelf:'center'}}>
    {Platform.OS==='ios' ?<LottieView source={require('../assets/UI/find-driver.json')} autoPlay loop speed={1.5} />: <Ionicons name="md-car" size={40} color={Color.lightBlue} style={{alignSelf:'center'}}/>}
    </View>
    <Text style={{fontSize:16, fontWeight:'600', color:Color.lightBlue}}>Looking for a driver for you...</Text>
    </View>
    }
    </RBSheet>

    
    
}



</View>
    
    
    
}

const styles= StyleSheet.create({
    mapContainer:{
        flex:1, 
    },
    locationButonContainer:{
        position:'absolute', 
        alignSelf:'flex-end', 
        top:'88.5%', 
        right:'5%',
        backgroundColor:Color.white,
        borderRadius:40,
        shadowColor:Color.Second, 
        shadowOffset:{width:1, height:3},
        shadowOpacity:0.5,
        shadowRadius:7
    },
        headerComponentContainer:{
            alignItems:'center',
            marginVertical:'5%'
        },
        headerComponentChildren:{},
        textHeader:{
            color:Color.Second,
            fontWeight:'500',
            fontSize:15
        },
        tableHeaderText:{
            color:Color.lightBlue,
            fontSize:15,
            fontWeight:'600'
        },
        tableRowText:{
            color:Color.Primary,
            fontWeight:'700',
            fontSize:15,
        },
        nameText:{
            color:Color.Primary,
            fontSize:20,
            fontWeight:'400',
            textAlignVertical:'center',
            padding:'5%',
            alignItems:'center'
        },
        nameTextContainer:{
           alignItems:'center',
           justifyContent:'center'
        },
        
    
})

export default MapPreview