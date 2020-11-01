import Delivery from "../../modal/delivery-class"

const initState= {
    driverCompleteOrder:{
        orderId:'',
        completed: true
    }
}

const driverReducer= (state=initState, action)=>{
    switch(action.type){
        case 'DRIVER_NOT_COMPLETE_ORDER':
            return{
                ...state,
                driverCompleteOrder:{
                    orderId: action.id,
                    completed: false
                }
            }
            case 'DRIVER_COMPLETE_ORDER':
                return{
                    driverCompleteOrder:{
                        orderId: '',
                        completed: true
                    }
                }
        default:
        return state 
    }
    
}

export default driverReducer