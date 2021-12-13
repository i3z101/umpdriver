import React, { useEffect } from 'react'
import {View, Text, StyleSheet, Platform,TouchableOpacity , ImageBackground, TouchableHighlight, Alert, Image} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../component/HeaderButton'
import { DrawerActions } from '@react-navigation/native';
import Color from '../../constants/Color';
import Card from '../../component/Card';
import LottieView from 'lottie-react-native';
import { Octicons,AntDesign, Ionicons} from '@expo/vector-icons';
import androidIconsStyles from '../../constants/androidIconsStyles'
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../store/authAction/authAction';
import * as Notifications from 'expo-notifications';
let findDriver;
let userProfile;
let userBadge;
const Home= props=>{

    useEffect(()=>{
        const background= Notifications.addNotificationResponseReceivedListener(resp=>{
        const badgeCount= resp.notification.request.content.badge 
        Notifications.setBadgeCountAsync(badgeCount-1).then(()=>{
            props.navigation.navigate(resp.notification.request.content.data.body.page,{
                deliveryId: resp.notification.request.content.data.body.deliveryId
            });
        })
        });
        return()=>{
          background.remove()
        }
      },[])

    

    let Touchable;
    findDriver= useSelector(state=>state.delivery.findDriver);
    userProfile= useSelector(state=>state.auth.userProfile);
    userBadge= useSelector(state=>state.auth.badge)

    

    if(Platform.OS==='android'){
        Touchable= TouchableHighlight 
    }
    else{
        Touchable= TouchableOpacity
    }

    return <View style={styles.container}>
    <View style={styles.cardContainer}>
    <Touchable onPress={()=>props.navigation.navigate('PickUp')} underlayColor={Color.white} style={{borderRadius: 10}}>
    <Card container={{justifyContent:'center'}}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
        Go somewhere
        </Text>
        </View>
        <View style={styles.icon}>
        {Platform.OS==='ios' ?<LottieView source={require('../../assets/UI/location.json')}  autoPlay loop/>: <Octicons name="location" size={40} color={Color.Primary} style={androidIconsStyles.android} />}
        </View>
    </Card>
    </Touchable>
    <Touchable onPress={()=>props.navigation.navigate('Delivery')}  underlayColor={Color.white} style={{borderRadius: 10}}>
    <Card container={{justifyContent:'center'}}>
    <View style={styles.textContainer}>
    <Text style={styles.text}>
        Delivery
    </Text>
    
    </View>
    <View style={styles.icon}>
    {Platform.OS==='ios'?<LottieView source={require('../../assets/UI/delivery.json')} autoPlay loop speed={1.5}/>:<AntDesign name="shoppingcart" size={40} color={Color.Primary} style={androidIconsStyles.android}/>}
    </View>
  </Card>
  </Touchable>
    </View>
   
    </View>
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
        alignSelf:'center'}
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
           color={Color.Second}
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
        color={Color.Second}
        iconSize={24}
        />
        </HeaderButtons>
    ),
       headerTintColor: Color.Second,
       headerTitleAlign:'center' 
    }
   
}

export default Home