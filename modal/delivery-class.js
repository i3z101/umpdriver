export default class Delivery{
    constructor(id, serviceType, description, address,googleMapUrl, time){
        this.id= id,
        this.serviceType= serviceType,
        this.description= description,
        this.address=address,
        this.googleMapUrl=googleMapUrl
        this.time= time
    }
}

export const dummyDelivery= new Delivery(new Date().toString(), "UMP", "test", "test","","10:00 pm")