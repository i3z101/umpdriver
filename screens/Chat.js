import React, { useState, useCallback, useEffect } from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {GiftedChat, InputToolbar, Time, Composer, Bubble, Send} from 'react-native-gifted-chat'
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Color from '../constants/Color';
import {database} from '../configDB'

let mounted=false;
let auth;
let userName;
let isTypingMessageDetails={
    id:null,
    userName: null,
    isTyping:null,
    userMode:null
  }
const Chat= props=>{
    const [messages, setMessages]= useState([])
    auth= useSelector(state=>state.auth)
    if(auth.userMode){
        userName=auth.userProfile.fullName
    }else if(!auth.userMode){
        userName= auth.driverProfile.fullName 
    }
    const onSend = useCallback((messagesSent = []) => {
        for(let i=0; i<messagesSent.length; i++){
          const chat={
            _id: messagesSent[i]._id,
            text: messagesSent[i].text,
            user: messagesSent[i].user,
            createdAt: new Date(messagesSent[i].createdAt).toISOString(),
            sent: true,
            received: true,
          }
          setMessages(prevState=>GiftedChat.append(prevState, messagesSent[i]))
          database.ref('messages/'+props.route.params.orderId).push(chat)
        }  
  }, []) 
  
  const fetchMessages= useCallback(()=>{
    const data= database.ref('messages/'+props.route.params.orderId).limitToLast(20)
    data.on('value', snapShot=>{  
      setMessages([])
          const message= snapShot.val()
          if(message){
            for(const key in message){
              setMessages(prevState=>GiftedChat.append(prevState,message[key]))
            }
          }
    }) 
},[])

const typingHandler= async(e)=>{
  const ref= database.ref('messages/'+props.route.params.orderId)
    if(e.length==1){
      if(!isTypingMessageDetails.id){
          for(let i=0; i< e.length; i++){
            const isTyping={
              _id:new Date().toISOString(),
              text:userName + " is typing...",
              user:{
                _id:auth.userId,
                name: userName,
                timestamp: new Date().getTime(),
                typing:true,
                userMode:auth.userMode?auth.userMode:auth.userMode
              }
            }
            ref.push(isTyping).then(val=>{
              isTypingMessageDetails={
                id: val.key,
                userName:userName,
                isTyping: true,
                userMode: auth.userMode
              }
            })
          }
        }
    }else if(e.length<1){
      database.ref('messages/'+props.route.params.orderId+'/'+isTypingMessageDetails.id).remove().then(()=>{
        isTypingMessageDetails={
          id:null,
          userName:null,
          userMode:null,
          isTyping:null
        }
      })
    }
  }



useEffect(()=>{
    mounted= true;
    if(mounted){
        fetchMessages()
    }
    return()=>mounted=false;
},[])


    return  <GiftedChat
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{
      _id: auth.userId,
      timestamp: new Date().getTime(),
      name:userName,
      avatar:'https://ouskinal.sirv.com/Images/Apple%20Watch%20white.jpg'
    }}
    showUserAvatar
    alwaysShowSend
    renderUsernameOnMessage={true}
    onInputTextChanged={e=>typingHandler(e)}
    messagesContainerStyle={{
      backgroundColor: Color.white
    }}
    renderBubble={props=>{
      return <Bubble {...props} wrapperStyle={{
        right:{
          backgroundColor: Color.Primary
        },
        left:{
          backgroundColor:'#add6ff'
        }
      }}
      usernameStyle={{
        color:'black'
      }}
      renderTime={props=>{
        return <Time {...props} timeTextStyle={{
          left:{
            color:'black'
          }
        }}/>
      }}
      />
    }}
    renderSend={props=>{
      return <Send {...props} containerStyle={{ justifyContent: 'center' }}>
      <MaterialIcons name="send" size={28} color="black" style={{alignItems:'center', marginRight:7}}/>
      </Send>
    }}
    renderComposer={props=>{
      return <Composer {...props} textInputStyle={{
        borderRadius:10,
        marginRight:5,
      }}
      
      />
    }}
    renderInputToolbar={props=>{
      return <InputToolbar {...props}  />
    }}
    />
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Chat