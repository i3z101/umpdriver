import { useSelector } from 'react-redux';
import {database} from '../../configDB';
export const addDeliveryOrder= (orderDate,userName,serviceType, description, address,googleMapUrl, time, userPhoneNumber)=>{
    return async (dispatch, getState)=>{
        try{
           const data= await fetch('https://ump-driver.firebaseio.com/deliveryOrder.json',{
               method:"POST",
               headers:{
                   'Content-Type':'application/json'
               },
               body: JSON.stringify({
                   orderDate,
                   userName,
                   serviceType,
                   description,
                   address,
                   googleMapUrl,
                   time,
                   findDriver:false,
                   completed: false,
                   userPhoneNumber
               })
           })
           const response= await data.json()
           dispatch({
               type:'ADD_DELIVERY_ORDER',
               data:{
                   id: response.name,
                   orderDate,
                   serviceType,
                   description,
                   address,
                   googleMapUrl,
                   time,
               }
           })
         
        }catch(err){
            throw err
        }
        
        
    }
 
}

export const cancelDeliveryOrder= (id)=>{
    return async(dispatch,getState)=>{
        await database.ref('deliveryOrder/'+id).remove()
        await database.ref('driverOrder/deliveryOrder/1/'+id).remove()

        dispatch({
            type:'CANCEL_ORDER',
            id
        })
    }
}

export const orderCancelationHandler=(id)=>{
    return async(dispatch,getState)=>{
        await database.ref('deliveryOrder/'+id).remove()
        dispatch({
            type:'CANCEL_ORDER',
            id
        })
    }
}

export const cancelPickupOrder= (id)=>{
    return async(dispatch,getState)=>{
        await database.ref('pickUpOrder/'+id).remove()
        await database.ref('driverOrder/pickUpOrder/1/'+id).remove()

        dispatch({
            type:'CANCEL_ORDER',
            id
        })
    }
}



export const pickUpOrder= (orderDate,userName,placeName, destination, arrivalTime, price, userPhoneNumber)=>{
    return async (dispatch)=>{
        try{
            const data= await fetch ('https://ump-driver.firebaseio.com/pickUpOrder.json',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                orderDate,
                userName,
                placeName,
                destination,
                arrivalTime,
                price,
                findDriver:false,
                completed: false,
                userPhoneNumber
            })
        })
        if(!data.ok){
            throw new Error("STH WRONG");
        }
        const response= await data.json();
        // console.log(response);
        dispatch({
            type:'ADD_PICKUP_ORDER',
            data:{
                id: response.name,
                orderDate,
                placeName,
                destination,
                arrivalTime,
                price
            }
        })
    }catch(err){
        console.log(err);
        throw err
    }
}
}


export const findDriver=(id)=>{
    return{
        type: "FIND_DRIVER",
        id: id
    }
}

export const acceptOrderInfo= (driverName, driverCarName, driverCarModel, driverCarColor)=>{
    return {
        type:'ACCEPT_ORDER',
        data:{
            driverName,
            driverCarName,
            driverCarModel,
            driverCarColor
        }
    }
}

export const driverNotCompleteOrder= (id)=>{
    return{
        type: 'DRIVER_NOT_COMPLETE_ORDER',
        id
    }
}

export const driverCompleteOrder=()=>{
    return{
        type: 'DRIVER_COMPLETE_ORDER',
    }
}     

export const addOrderToHistory=(deliveryOrder)=>{
    return{
        type:'ADD_TO_HISTORY',
        deliveryOrder
    }
}

export const addDeliveryProfile= (driverProfile)=>{
    return{
        type: 'ADD_DRIVER_PROFILE',
        driverProfile
    }
}