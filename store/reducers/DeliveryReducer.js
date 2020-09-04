import Delivery, { dummyDelivery } from '../../modal/delivery-class'
import { dummyDriver } from '../../modal/driver-class'

const initState= {
    deliveryOrder:[],
    deliveyHistory:[],
    driver:[dummyDriver]
}

const deliveryReducer=(state=initState, action)=>{
    switch(action.type){
        case 'ADD_DELIVERY_ORDER':
           if(!state.deliveryOrder[action.id]){
            const newDeliveryOrder= new Delivery(action.data.id, action.data.serviceType, action.data.description, action.data.address, action.data.gooleMapUrl, action.data.time)
                        return{
                            ...state,
                            deliveryOrder: state.deliveryOrder.concat(newDeliveryOrder),
                            deliveryHitory:state.deliveryOrder.concat(newDeliveryOrder),
                        }
           }else{
               return state
           }
            
        case 'CANCEL_ORDER':
            const deliveryOrderCopy= {...state.deliveryOrder} 
            const deliveryOrderIndex= state.deliveryOrder.findIndex(del=>del.id===action.id)
            return{
                ...state,
                deliveryOrder: state.deliveryOrder.splice(1,deliveryOrderIndex)
            }
        
        default:
            return state
    }
}

export default deliveryReducer