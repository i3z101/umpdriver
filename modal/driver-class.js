export default class Driver{
    constructor(id, driverName, driverCar, driverCarModel, driverCarColor){
        this.id= id,
        this.driverName=driverName,
        this.driverCar= driverCar,
        this.driverCarModel=driverCarModel,
        this.driverCarColor=driverCarColor
    }
}

export const dummyDriver= new Driver(new Date().toString(), "Aziz", "Saga", "2010", "black")