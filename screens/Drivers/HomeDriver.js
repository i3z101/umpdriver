import React, { useEffect, useState } from 'react'
import {View, Text, StyleSheet, Platform,TouchableOpacity, TouchableHighlight, ImageBackground} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import { DrawerActions } from '@react-navigation/native';
import Color from '../../constants/Color';
import Card from '../../component/Card';
import LottieView from 'lottie-react-native';
import { Octicons,AntDesign, Ionicons } from '@expo/vector-icons';
import androidIconsStyles from '../../constants/androidIconsStyles';
import { database } from '../../configDB';
import { Button, TextInput } from 'react-native-paper';
import { fetchDriverData,insertDriverDetails } from '../../dbSQL';
import { isEmptyArray } from 'formik';
import { set } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../store/authAction/authAction';

let userId;
let driverProfile;
const Home= props=>{
    userId= useSelector(state=>state.auth.userId);
    driverProfile= useSelector(state=>state.auth.driverProfile);
    const [completeForm, setCompleteForm]= useState(true)
    const [driverDetails, setDriverDetails]= useState({
        driverFirstName:'',
        driverLastName:'',
        driverCarName:'',
        driverCarModel:'',
        driverLicensePlate:'',
        driverCarColor:''
    })
    let Touchable;
    let home;
    

    const handleDriverData=(inputName,inputValu)=>{
        setDriverDetails(prevState=>({
            ...prevState,
            [inputName]:inputValu
        }))
    }

    const handleSubmitDriverData=async()=>{
        for (const key in driverDetails) {
            if(driverDetails[key]===''){
                console.log("error in your object");
                return
            }
        }
        await insertDriverDetails(driverDetails.driverFirstName,driverDetails.driverLastName,driverDetails.driverCarName,driverDetails.driverCarModel,driverDetails.driverLicensePlate,driverDetails.driverCarColor,true)
        setCompleteForm(true)
    }
  
    if(Platform.OS==='android'){
        Touchable= TouchableHighlight
    }
    else{
        Touchable= TouchableOpacity
    }


    if(!completeForm){
            home= (
                <View>
                    <View style={styles.driversContainer}>
                        <TextInput mode='outlined' label="Driver first name" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'50%'}}
                        value={driverDetails.driverFirstName}
                        onChangeText={(inputvalue)=>handleDriverData('driverFirstName',inputvalue)}
                        />
                        <TextInput mode='outlined' label="Driver last name" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'45%'}}
                        value={driverDetails.driverLastName}
                        onChangeText={(inputvalue)=>handleDriverData('driverLastName', inputvalue)}
                        />
                    </View>
                    <View style={styles.driversContainer}>
                        <TextInput mode='outlined' label="Driver car name" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'50%'}}
                        value={driverDetails.driverCarName}
                        onChangeText={(inputvalue)=>handleDriverData('driverCarName',inputvalue)}
                        />
                        <TextInput mode='outlined' label="Driver car model" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'45%'}}
                        value={driverDetails.driverCarModel}
                        onChangeText={(inputvalue)=>handleDriverData('driverCarModel',inputvalue)}
                        keyboardType='numeric'
                        />
                        
                    </View>
                    <View style={styles.driversContainer}>
                        <TextInput mode='outlined' label="Driver lisence plate" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'50%'}}
                        value={driverDetails.driverLicensePlate}
                        onChangeText={(inputvalue)=>handleDriverData('driverLicensePlate',inputvalue)}
                        />
                        <TextInput mode='outlined' label="Driver car color" maxLength={15} theme={{
                            roundness:10,
                            colors:{
                                primary:Color.Primary
                            }
                        }}
                        style={{width:'45%'}}
                        value={driverDetails.driverCarColor}
                        onChangeText={(inputvalue)=>handleDriverData('driverCarColor',inputvalue)}
                        />
                    </View>
                    <Button mode='contained' children={"Save"} color={Color.lightBlue} style={styles.button} onPress={handleSubmitDriverData}/>
                </View>
            )
    }
    else{
        home= (
            <View style={styles.container}>
    <View style={styles.cardContainer}>
    <Touchable onPress={()=>props.navigation.navigate('Pickup orders')} underlayColor={Color.white} style={{borderRadius: 10}}>
    <Card container={{justifyContent:'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
        Pickup order
        </Text>
        
        </View>
        <View style={styles.icon}>
        {Platform.OS==='ios'?<LottieView source={require('../../assets/UI/location.json')}  autoPlay loop/>:<Octicons name="location" size={40} color={Color.lightBlue} style={androidIconsStyles.android}/>}
        </View>
    </Card>
    </Touchable>
    <Touchable onPress={()=>props.navigation.navigate('Delivery orders')} underlayColor={Color.white} style={{borderRadius: 10}}>
    <Card container={{justifyContent:'center'}}>
    <View style={styles.textContainer}>
    <Text style={styles.text}>
        Delivery order
    </Text>
    
    </View>
    <View style={styles.icon}>
    {Platform.OS==='ios'?<LottieView source={require('../../assets/UI/delivery.json')} autoPlay loop speed={1.5}/>: <AntDesign name="shoppingcart" size={40} color={Color.lightBlue} style={androidIconsStyles.android}/>}
    </View>
  </Card>
  </Touchable>
    </View>
   
    </View>
        )
    }

    return home
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Color.white,
    },
    cardContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    text:{
        color:Color.Second,
        fontSize:17,
        fontWeight:'400',
    },
    textContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5
    },
    icon:{
        width:'100%', 
        height:'65%', 
        alignSelf:'center'
    },
    driversContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        margin:5,
        marginVertical:20
    },
    button:{
        width:'65%',
        alignSelf:'center',
        marginTop:20
    }
})

export const OrderOptionStyle= navData=>{
    const dispatch= useDispatch()
    return{
       headerLeft: ()=>(
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
           <Item
           IconComponent={Ionicons}
           iconName={Platform.OS==='android'? 'md-menu' : 'ios-menu'}
           title='menu'
           onPress={()=>{navData.navigation.dispatch(DrawerActions.openDrawer());}}
           color={Color.white}
           iconSize={24}
           />
           </HeaderButtons>
       ),
       headerRight: ()=>(
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
        IconComponent={AntDesign}
        iconName={'poweroff'}
        title='log out'
        onPress={()=>{dispatch(logOut())}}
        color={Color.white}
        iconSize={24}
        />
        </HeaderButtons>
    ),
       headerTintColor: Color.white,
       headerTitleAlign:'center' 
    }
   
}

export default Home