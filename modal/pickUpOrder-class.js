export default class PickUpOrder{
    constructor(orderId, orderDate, placeName, destination, arrivalTime, price){
        this.orderId= orderId;
        this.orderDate= orderDate;
        this.placeName= placeName;
        this.destination= destination;
        this.arrivalTime= arrivalTime;
        this.price= price;
    }
}