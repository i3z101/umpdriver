import { exp } from "react-native-reanimated"
import { auth, database } from "../../configDB"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userAuthRegister= (email, password, fullName, phoneNumber, gender)=>{
    return async(dispatch)=>{
        try{
        const dataSend= await auth.createUserWithEmailAndPassword(email, password)
        const idToken= await dataSend.user.getIdToken()
        const userId= dataSend.user.uid
        await database.ref('userProfile/'+userId).push({
            email,
            fullName,
            phoneNumber,
            gender,
            type:'user'
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
                        })
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
        const expirationTime=new Date(expiryTime.expirationTime).getTime();
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
                    })
                    const userDetails= JSON.stringify({
                        idToken: idToken,
                        userMode: true,
                        expirationTime: expirationTime
                    })
                    await AsyncStorage.setItem('userDetails', userDetails)
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

        await database.ref('driverProfile/'+userId).push({
            email,
            fullName,
            phoneNumber,
            gender,
            type:'driver'
        })
        const data= database.ref('userProfile/'+userId)
        data.once('value', res=>{
            const response= res.val()
            if(response){
               for (const key in response) {
                    if(response[key].type==='driver'){
                        dispatch({
                        type:'DRIVER_AUTH',
                        idToken:idToken,
                        userId: userId,
                        })
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
                        })
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
    }
}