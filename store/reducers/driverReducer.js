import Delivery from "../../modal/delivery-class"

const initState= {
    orderList: [ new Delivery(Math.floor(Math.random()*10).toString(), "UMP", "test", "test","","10:00 pm"), new Delivery(new Date().toString(), "NIRWANA", "test", "KK4","","10:00 AM")]
}

const driverReducer= (state=initState, action)=>{
    return state
}

export default driverReducer