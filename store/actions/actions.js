

export const addDeliveryOrder= (serviceType, description, address,googleMapUrl, time)=>{
    return async (dispatch, getState)=>{
        try{
            const data= await fetch('https://ump-driver.firebaseio.com/deliveryOrder.json',{
                method:"POST",
                headers:{
                    'Content-Type':'Application.json'
                },
                body: JSON.stringify({
                    serviceType,
                    description,
                    address,
                    googleMapUrl,
                    time
                })
            })
            if(!data.ok){
                new Error("ERROR")
            }
            const response= await data.json()
        }catch(err){
            throw err
        }
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