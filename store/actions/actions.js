

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
            dispatch({
                type:"ADD_DELIVERY_ORDER",
           data:{
               id:response.name,
               serviceType,
               description,
               address,
               googleMapUrl,
               time
           }
           })
        }catch(err){
            throw err
        }
        
       
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

export const pickUpOrder= (orderDate,placeName, destination, arrivalTime, price)=>{
    return async (dispatch)=>{
        try{
            const data= await fetch ('https://ump-driver.firebaseio.com/pickUpOrder.json',{
            method:'POST',
            'Conetnt-Type':'Application/json',
            body: JSON.stringify({
                orderDate,
                placeName,
                destination,
                arrivalTime,
                price
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