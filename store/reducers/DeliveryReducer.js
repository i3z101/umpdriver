import { object } from 'yup'
import Delivery, { dummyDelivery } from '../../modal/delivery-class'
import { dummyDriver } from '../../modal/driver-class'
 
const initState= {
    deliveryOrder:{},
}

const deliveryReducer=(state=initState, action)=>{
    switch(action.type){ 
        case 'ADD_DELIVERY_ORDER':
            const newDeliveryOrder= new Delivery(action.data.id,action.data.orderDate, action.data.serviceType, action.data.description, action.data.address, action.data.gooleMapUrl, action.data.time)
                    // console.log(action.data);
                    return {
                        ...state,
                        deliveryOrder: newDeliveryOrder,
                    }
                    
        case 'FIND_DRIVER':
            return {
                ...state,
                deliveryOrder: {},
            }
           
        // case 'CANCEL_ORDER':
        //     const deliveryOrderCopy= {...state.deliveryOrder} 
        //     const deliveryOrderIndex= state.deliveryOrder.findIndex(del=>del.id===action.id)
        //     return{
        //         ...state,
        //         deliveryOrder: state.deliveryOrder.splice(1,deliveryOrderIndex)
        //     }
        
        default:
            return state
    }
}

export default deliveryReducer