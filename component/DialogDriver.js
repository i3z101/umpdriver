import React from 'react'
import {Platform, View, Text, Linking, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Dialog,Button} from 'react-native-paper'
import Color from '../constants/Color'
import {Ionicons,MaterialIcons, FontAwesome} from '@expo/vector-icons'
import {Avatar, Card} from 'react-native-elements'


const DialogDriver= props=>{
    let Touch;
    if(Platform.OS==='ios'){
        Touch= TouchableOpacity
    }else{
        Touch= TouchableWithoutFeedback
    }
    const makeCall=()=>{
        if(Platform.OS==='ios'){
            Linking.openURL(`telprompt:${props.driverPhoneNumber}`)
        }else{
            Linking.openURL(`tel:${props.driverPhoneNumber}`)
        }
    }



    return <Dialog visible={props.visible} theme={{roundness:20}}>
    <Dialog.Title style={{alignSelf:'center', justifyContent:'space-between'}}>
    <Text > Driver Details</Text>
    </Dialog.Title>
            <Dialog.Content style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
            <Avatar rounded source={{uri:props.source}} imageProps={{resizeMode:'contain'}} size={60}/>
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

                <Touch style={{width:'30%', alignItems:'center', backgroundColor:Color.Primary, borderRadius:10, padding:10}} onPress={props.chatPage}>
                    <FontAwesome name="wechat" size={38} color={Color.white} />
                </Touch>
                <Touch style={{width:'30%', alignItems:'center', backgroundColor:Color.Primary, borderRadius:10, padding:10}} >
                <Ionicons name={Platform.OS==='ios'? "ios-call":"md-call"} size={35} color={Color.white} onPress={()=>makeCall()}/>
                </Touch>
            </Dialog.Content>
            <Card containerStyle={{backgroundColor:Color.Primary, borderRadius:10, marginBottom:4, width:'60%', alignSelf:'center'}}>
                        <Text style={{fontSize:20, color:Color.white, fontWeight:'900',textAlign:'center'}}>{props.driverLicensePlate.toUpperCase()}</Text>
            </Card>
            <Dialog.Actions style={{alignSelf:'center'}}>
                <Button children={<Text>Cancel ):</Text>} style={{marginHorizontal:10}} color='tomato' onPress={props.onPressCancel} disabled={props.cannotCancel?true:false}/>
                <Button children={<Text>Awesome!</Text>} style={{marginHorizontal:10}} color={Color.lightBlue} onPress={props.onPressAwesome}/>
            </Dialog.Actions>
        </Dialog>
}

export default DialogDriver