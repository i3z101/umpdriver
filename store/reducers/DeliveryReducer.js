import Delivery from '../../modal/delivery-class'
import { dummyDriver } from '../../modal/driver-class'

const initState= {
    delivery:[],
    driver:[dummyDriver]
}

const deliveryReducer=(state=initState, action)=>{
    switch(action.type){
        case 'addDeliveryOrder':
            const newDeliveryOrder= new Delivery(new Date().toString(), action.data.serviceType, action.data.description, action.data.address, action.data.gooleMapUrl, action.data.time)
            return{
                ...state,
                delivery: state.delivery.concat(newDeliveryOrder)
            }
        default:
            return state
    }
}

export default deliveryReducer