import PickUpOrder from "../../modal/pickUpOrder-class"
import { dummyDriver } from '../../modal/driver-class'
const initState= {
    pickUpOrder:{},
    driver:dummyDriver
}
  
const pickUpReducer=(state=initState, action)=>{
    switch(action.type){
        case 'ADD_PICKUP_ORDER':
            const newPickupOrder= new PickUpOrder(action.data.id, action.data.orderDate, action.data.placeName, action.data.destination, action.data.arrivalTime, action.data.price)
            return{
                ...state,
                pickUpOrder: action.data
            }
        case 'FIND_DRIVER':
            return {
                ...state,
                pickUpOrder: {} 
            }
        default:
            return state
    }
} 

export default pickUpReducer