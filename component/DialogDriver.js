import React from 'react'
import {Platform, View, Text, Linking} from 'react-native'
import {Dialog,Button} from 'react-native-paper'
import Color from '../constants/Color'
import {Ionicons,MaterialIcons} from '@expo/vector-icons'
import {Avatar, Card} from 'react-native-elements'


const DialogDriver= props=>{

    const makeCall=()=>{
        if(Platform.OS==='ios'){
            Linking.openURL(`telprompt:${props.driverPhoneNumber}`)
        }else{
            Linking.openURL(`tel:${props.driverPhoneNumber}`)
        }
    }

    return <Dialog visible={props.visible} theme={{roundness:20}}>
    <Dialog.Title style={{alignSelf:'center'}}>
    <Text > Driver Details</Text></Dialog.Title>
            <Dialog.Content style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
            <Avatar rounded source={props.source} imageProps={{resizeMode:'contain'}} size={60}/>
            <Text style={{fontWeight:"700", fontSize:20, color:Color.Primary}}>{props.driverName.toUpperCase()}</Text>
            </Dialog.Content>
            <Dialog.Content style={{alignItems:'center', flexDirection:'row', justifyContent:'space-around'}}>
                <Ionicons name="logo-model-s" size={40} color={Color.lightBlue} />
                <MaterialIcons name="date-range" size={40} color={Color.lightBlue}/>
                <MaterialIcons name="color-lens" size={40} color={Color.lightBlue}/>
            </Dialog.Content>
            <Dialog.Content style={{alignItems:'center', flexDirection:'row', justifyContent:'space-around'}}>
                <Text style={{textAlign:'center', fontSize:17, color:Color.Second, fontWeight:'600'}}>{props.driverCarName}</Text>
                <Text style={{textAlign:'center', fontSize:17, color:Color.Second, fontWeight:'600'}}>{props.driverCarModel}</Text>
                <Text style={{textAlign:'center', fontSize:17, color:Color.Second, fontWeight:'600'}}>{props.driverCarColor}</Text>
            </Dialog.Content>

            <Dialog.Content style={{alignItems:'center', flexDirection:'row', justifyContent:'space-evenly'}}>

                <Card containerStyle={{width:'60%', alignItems:'center', backgroundColor:Color.Primary, borderRadius:10}}>
                        <Text style={{fontSize:20, color:Color.white, fontWeight:'900'}}>{props.driverLicensePlate.toUpperCase()}</Text>
                </Card>
                <Card containerStyle={{width:'30%', alignItems:'center', backgroundColor:Color.Primary, borderRadius:10, padding:10}} >
                <Ionicons name={Platform.OS==='ios'? "ios-call":"md-call"} size={35} color={Color.white} onPress={()=>makeCall()}/>
                </Card>
                
            </Dialog.Content>
            
            <Dialog.Actions style={{alignSelf:'center'}}>
                <Button children={<Text>Cancel ):</Text>} style={{marginHorizontal:10}} color='tomato' onPress={props.onPressCancel} disabled={props.cannotCancel?true:false}/>
                <Button children={<Text>Awesome!</Text>} style={{marginHorizontal:10}} color={Color.lightBlue} onPress={props.onPressAwesome}/>
            </Dialog.Actions>
        </Dialog>
}

export default DialogDriver