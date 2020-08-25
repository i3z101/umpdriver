

export const addDeliveryOrder= (serviceType, description, address,googleMapUrl, time)=>{
    return(dispatch, getState)=>{
        dispatch({
             type:"ADD_DELIVERY_ORDER",
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

export const cancelOrder= (id)=>{
    return(dispatch,getState)=>{
        dispatch({
            type:'CANCEL_ORDER',
            id
        })
    }
}