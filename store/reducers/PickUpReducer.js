import PickUpOrder from "../../modal/pickUpOrder-class"

const initState= {
    pickUpOrder:[]
}

const pickUpReducer=(state=initState, action)=>{
    switch(action.type){
        case 'ADD_PICKUP_ORDER':
            const newPickupOrder= new PickUpOrder(action.data.id, action.data.orderDate, action.data.placeName, action.data.destination, action.data.arrivalTime, action.data.price)
            return{
                ...state,
                pickUpOrder: state.pickUpOrder.concat(newPickupOrder)
            }
        default:
            return state
    }
}

export default pickUpReducer