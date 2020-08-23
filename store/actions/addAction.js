import React from 'react'

export const addDeliveryOrder= (serviceType, description, address,googleMapUrl, time)=>{
    return(dispatch, getState)=>{
        dispatch({
             type:"addDeliveryOrder",
        data:{
            serviceType,
            description,
            address,
            googleMapUrl,
            time
        }
        })
       
    }
}