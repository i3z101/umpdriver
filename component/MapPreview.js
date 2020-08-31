import React, { useState, useEffect } from 'react'
import {View, StyleSheet, TextInput, SafeAreaView, Platform, FlatList, TouchableOpacity, Alert, Dimensions} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import Color from '../constants/Color'
import SearchBarView from './SearchBar'
import { MaterialIcons } from '@expo/vector-icons';
import vars from '../helper' 
import GoogleAC from '../modal/autoComplete-class'
import SearchPlaceView from './modalSerch'
import {Text,Divider} from 'react-native-paper'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'



const MapPreview= props=>{

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
        setSelectedPlace({
            lat: response.coords.latitude,
            lng: response.coords.longitude
        })
    }

    useEffect(()=>{
      
       getCurrentLocation()
    },[])
  

    const [selectedPlace, setSelectedPlace]= useState({
        name:'',
        lat:null,
        lng:null
    })

    
   
    const [searchPlace, setSearchPlace]= useState('')
    const [autoCompletePlaces, setAutoCompletePlaces]= useState([])

    const changeSearchHandler= async(e)=>{
        try{
            const data= await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${e}&key=${vars.googleApiKey}`,{
                method:'POST'
            })
            if(!data.ok){
                throw new Error("something wrong")
            }
            const response= await data.json()
            // console.log(response.predictions.map(d=>d.place_id));
            // console.log(response.predictions.map(d=>d.description));
            if(response.status=="ZERO_RESULTS"){
                return;
            }
            if(response.status=="INVALID_REQUEST"){
                return;
            }
         
            let autoCompletePlaces=[]
           
            const autoCompleteGoogle= new GoogleAC(response.predictions[response.predictions.length-1].place_id, response.predictions[response.predictions.length-1].description)
            autoCompletePlaces.unshift(autoCompleteGoogle)
            setAutoCompletePlaces(autoCompletePlaces)
            setSearchPlace(e)
            if(e.length<=1){
                autoCompletePlaces=[]
                setAutoCompletePlaces([])
            }
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
        latitude: selectedPlace.lat? selectedPlace.lat : 3.822210,
        longitude: selectedPlace.lng? selectedPlace.lng :103.335450,
        latitudeDelta:0.0922,
        longitudeDelta:0.0421
    }

    const pickPlace= event=>{
       setSelectedPlace({
           lat: event.nativeEvent.coordinate.latitude,
           lng:event.nativeEvent.coordinate.longitude,
       })
       
    }

    let markConfig;

    if(selectedPlace){
        markConfig={
            latitude: selectedPlace.lat,
            longitude: selectedPlace.lng
        }
    }

    return <View style={styles.mapContainer}>
    <MapView style={styles.mapContainer} region={mapConfig} provider={'google'}  onPress={pickPlace} onMarkerDragEnd={pickPlace} mapType='standard'   >
   
    
    {selectedPlace.lat&&selectedPlace.lng&&<Marker title='here' coordinate={markConfig} pinColor={Color.Primary}/>}
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
    onPress={(data, details)=>setSelectedPlace({
        name:data.description,
        lat:details.geometry.location.lat, 
        lng:details.geometry.location.lng
    })}
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
        shadowRadius:7}
    
})

export default MapPreview