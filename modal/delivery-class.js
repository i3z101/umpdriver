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