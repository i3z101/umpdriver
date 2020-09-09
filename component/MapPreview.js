import React, { useState, useEffect, useRef } from 'react'
import {View, StyleSheet, Platform, TouchableOpacity, Alert, Dimensions, Modal} from 'react-native'
import MapView, {Marker, Callout, Polyline} from 'react-native-maps'
import Color from '../constants/Color'
import { MaterialIcons,AntDesign } from '@expo/vector-icons';
import vars from '../helper' 
import GoogleAC from '../modal/autoComplete-class'
import {Text, Button, DataTable} from 'react-native-paper'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import {Modalize} from 'react-native-modalize'
import MapViewDirections from 'react-native-maps-directions'
import { useDispatch, useSelector } from 'react-redux';
import { pickUpOrder } from '../store/actions/actions';
import  moment from 'moment'
import LottieView from 'lottie-react-native';
import RBSheet from "react-native-raw-bottom-sheet";

const MapPreview= props=>{

    const width= Dimensions.get('window').width
    const height= Dimensions.get('window').height
    const aspectRatio= width/height

    let markCurrentPositionConfig;
    let markDestinationConfig

    let Touch= TouchableOpacity

    if(Platform.OS==='android'){
        Touch= TouchableWithoutFeedback
    }

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
      
       getCurrentLocation()
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
    const [showPlaceDetails, setShowPlaceDetails]= useState(false)
    const [driverFound, setDriverFound]= useState(false)
    const btmSheet= useRef(Modalize)
    const [showDriverDetails, setShowDriverDetails]= useState(false)
    const driverDetails= useRef()
    const dispatch= useDispatch()

    // const changeSearchHandler= async(e)=>{
    //     try{
    //         const data= await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${e}&key=${vars.googleApiKey}`,{
    //             method:'POST'
    //         })
    //         if(!data.ok){
    //             throw new Error("something wrong")
    //         }
    //         const response= await data.json()
    //         // console.log(response.predictions.map(d=>d.place_id));
    //         // console.log(response.predictions.map(d=>d.description));
    //         if(response.status=="ZERO_RESULTS"){
    //             return;
    //         }
    //         if(response.status=="INVALID_REQUEST"){
    //             return;
    //         }
         
    //         let autoCompletePlaces=[]
           
    //         const autoCompleteGoogle= new GoogleAC(response.predictions[response.predictions.length-1].place_id, response.predictions[response.predictions.length-1].description)
    //         autoCompletePlaces.unshift(autoCompleteGoogle)
    //         setAutoCompletePlaces(autoCompletePlaces)
    //         setSearchPlace(e)
    //         if(e.length<=1){
    //             autoCompletePlaces=[]
    //             setAutoCompletePlaces([])
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw err
    //     }   
      
    // }



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
       }, 850);
       
    }catch(err){
        console.log(err);
        throw err
    }
      
    }

    // const SubmitPlaceHandler= async ()=>{
    //     let lat, lng
    //     if(searchPlace){
    //         try{
    //             const data= await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchPlace}&inputtype=textquery&fields=formatted_address,name,geometry&key=${vars.googleApiKey}`,{
    //             method:'GET'
    //         })
    //             if(!data.ok){
    //                 throw new Error("Something wrong")
    //             }
    //             const response= await data.json()
               
    
    //             // console.log(response);
    
    //              lat=  await response.candidates[response.candidates.length-1].geometry.location.lat
    //              lng= await response.candidates[response.candidates.length-1].geometry.location.lng
            
                
            
    //            setSelectedPlace({
    //             name:searchPlace,  
    //             lat: lat,
    //             lng:lng
    //         })

    //         setSearchPlace('')
           

            
    //         setAutoCompletePlaces([])

           
    //         // const placeId= response.candidates[response.candidates.length-1].place_id
           
    //     //    const selectPlace= await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY`)
    //     }catch(err){
    //         console.log(err);
    //         throw err
    //     }
    //     }
     
    // }



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

    const addPickUpOrder= (placeName, destination, arrivalTime, price)=>{
            // const orderDate= moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");
            //   dispatch(pickUpOrder(orderDate,placeName, destination, arrivalTime, price))
            btmSheet.current.close()
            setShowDriverDetails(true)
            setTimeout(() => {
                driverDetails.current.open()
               }, 300);
           
           
            
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
    <MapView style={styles.mapContainer} region={mapConfig} provider={'google'}  onPress={pickPlace} onMarkerDragEnd={pickPlace} mapType='standard' >
   
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



<Touch style={styles.locationButonContainer} onPress={getCurrentLocation}>
<MaterialIcons name="my-location" size={30} color={Color.Second} style={{padding:12}}/>
</Touch>

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
    height={220}
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
    {driverFound?
        <View>
    <Text>DRIVER FOUND</Text>
    <View style={{marginVertical:10}}>
    <Button children={"close"} onPress={()=>{
        driverDetails.current.close()
        setDriverFound(false)
        
    }}/>
    </View>
    </View>
    :<View>
    <View style={{width:120, height:120, alignSelf:'center'}}>
    <LottieView source={require('../assets/UI/find-driver.json')} autoPlay loop speed={1.5}/>
    </View>
    <Text style={{fontSize:16, fontWeight:'600', color:Color.lightBlue}}>Looking for a driver for you...</Text>
    <View style={{marginVertical:10}}>
    <Button children={"find"} onPress={()=>setDriverFound(true)}/>
    </View>
    
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