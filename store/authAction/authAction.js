import { exp } from "react-native-reanimated"
import { auth, database } from "../../configDB"
import {AsyncStorage} from 'react-native'
import * as Notifications from 'expo-notifications'

export const userAuthRegister= (email, password, fullName, phoneNumber, gender)=>{
    return async(dispatch)=>{
        try{
        const dataSend= await auth.createUserWithEmailAndPassword(email, password)
        const idToken= await dataSend.user.getIdToken()
        const userId= dataSend.user.uid
        const expiryTime= await dataSend.user.getIdTokenResult()
        const expirationTime=new Date(expiryTime.expirationTime).getTime();
        const badge= await Notifications.getBadgeCountAsync()
        const idPushToken= await Notifications.getExpoPushTokenAsync()
        await database.ref('userProfile/'+userId).push({
            email,
            fullName,
            phoneNumber,
            gender,
            type:'user',
            idPushToken: idPushToken
        })
        const data= database.ref('userProfile/'+userId)
        data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                    if(response[key].type==='user'){
                        dispatch({
                        type:'USER_AUTH',
                        idToken:idToken,
                        userId: userId,
                        badge: badge
                        })
                        dispatch({
                            type: 'ADD_USER_PROFILE',
                            userProfile: response[key]
                        })
                        const userDetails= JSON.stringify({
                            idToken: idToken,
                            userId:userId,
                            userMode: true,
                            expirationTime: expirationTime
                        })
                        AsyncStorage.setItem('userDetails', userDetails)
                    }
                }
            }else{
                dispatch({
                    type:'AUTH_ERROR'
                })
            }
            })
        
        
        }catch(err){
            console.log(err);
            throw(err)
        }
        
    }
}



export const userAuthLogin= (email, password)=>{
    return async(dispatch)=>{
        try{
        const dataSend= await auth.signInWithEmailAndPassword(email, password)
        const idToken= await dataSend.user.getIdToken()
        const userId= dataSend.user.uid
        const expiryTime= await dataSend.user.getIdTokenResult()
        const expirationTime=new Date(expiryTime.expirationTime).getTime()
        const badge= await Notifications.getBadgeCountAsync()
        const data= database.ref('userProfile/'+userId)
         data.once('value', res=>{
        const response= res.val()
        if(response){
           for (const key in response) {
                if(response[key].type==='user'){
                    dispatch({
                    type:'USER_AUTH',
                    idToken:idToken,
                    userId: userId,
                    badge: badge
                    })
                    dispatch({
                        type: 'ADD_USER_PROFILE',
                        userProfile: response[key]
                    })
                    const userDetails= JSON.stringify({
                        idToken: idToken,
                        userId:userId,
                        userMode: true,
                        expirationTime: expirationTime
                    })
                    AsyncStorage.setItem('userDetails', userDetails)
                    
                }
            }
        }
        else{
            dispatch({
                type:'AUTH_ERROR'
            })
        }
        })
        
        }catch(err){
            console.log(err);
            throw(err)
        }
        
    }
}

export const driverAuthRegister= (email, password, fullName, phoneNumber, gender)=>{
    return async(dispatch)=>{
        try{
        const dataSend= await auth.createUserWithEmailAndPassword(email, password)
        const idToken= await dataSend.user.getIdToken()
        const userId= dataSend.user.uid
        const expiryTime= await dataSend.user.getIdTokenResult()
        const expirationTime=new Date(expiryTime.expirationTime).getTime();
        const badge= await Notifications.getBadgeCountAsync()
        const idPushToken= await Notifications.getExpoPushTokenAsync()
        await database.ref('driverProfile/'+userId).push({
            email,
            fullName,
            phoneNumber,
            gender,
            type:'driver',
            idPushToken:idPushToken
        })
        const data= database.ref('driverProfile/'+userId)
        data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                    if(response[key].type==='driver'){
                        dispatch({
                        type:'DRIVER_AUTH',
                        idToken:idToken,
                        userId: userId,
                        badge: badge
                        })
                        dispatch({
                            type: 'ADD_DRIVER_PROFILE',
                            driverProfile: response[key]
                        })
                        const userDetails= JSON.stringify({
                            idToken: idToken,
                            userId:userId,
                            userMode: false,
                            expirationTime: expirationTime
                        })
                        AsyncStorage.setItem('userDetails', userDetails)
                    }
                }
            }else{
                dispatch({
                    type:'AUTH_ERROR'
                })
            }
            })
        }catch(err){
            console.log(err);
            throw(err)
        }
        
    }
}


export const driverAuthLogin= (email, password)=>{
    return async(dispatch)=>{
        try{
        const dataSend= await auth.signInWithEmailAndPassword(email, password)
        const idToken= await dataSend.user.getIdToken()
        const userId= dataSend.user.uid
        const expiryTime= await dataSend.user.getIdTokenResult()
        const expirationTime=new Date(expiryTime.expirationTime).getTime();
        const badge= await Notifications.getBadgeCountAsync()
        const data= database.ref('driverProfile/'+userId)
        data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                    if(response[key].type==='driver'){
                        dispatch({
                        type:'DRIVER_AUTH',
                        idToken:idToken,
                        userId: userId,
                        badge:badge
                        })
                        dispatch({
                            type: 'ADD_DRIVER_PROFILE',
                            driverProfile: response[key]
                        })
                        const userDetails= JSON.stringify({
                            idToken: idToken,
                            userId:userId,
                            userMode: false,
                            expirationTime: expirationTime
                        })
                        AsyncStorage.setItem('userDetails', userDetails)
                    }
                }
            }else{
                dispatch({
                    type:'AUTH_ERROR'
                })
            }
            })
        }catch(err){
            console.log(err);
            throw(err)
        }
        
    }
}

export const changeUserMode= ()=>{
    return{
        type:'CHANGE_USER_MODE',
    }
}

export const hideError=()=>{
    return{
        type: 'HIDE_ERROR'
    }
}

export const logOut=()=>{
    return async(dispatch)=>{
        await auth.signOut()
        dispatch({
            type:'LOGOUT'
        })
        AsyncStorage.removeItem('userDetails')
    }
}

export const didTryAuth=()=>{
    return{
        type:'DID_TRY'
    }
} 

export const autoAuth=(userMode,idToken, userId)=>{
    return async(dispatch)=>{
        const badge= await Notifications.getBadgeCountAsync()
        if(userMode){
            dispatch({
                type:'AUTO_AUTH_USER',
                idToken,
                userId,
                badge: badge
            })
            const data= database.ref('userProfile/'+userId)
            data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                        dispatch({
                            type: 'ADD_USER_PROFILE',
                            userProfile: response[key]
                        })
               }
            }
        })
        }else{
            dispatch({
                type:'AUTO_AUTH_DRIVER',
                idToken,
                userId,
                badge: badge
            })
            const data= database.ref('driverProfile/'+userId)
            data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                        dispatch({
                            type: 'ADD_DRIVER_PROFILE',
                            driverProfile: response[key]
                        })
               }
            }
        })
    }
    }
}
