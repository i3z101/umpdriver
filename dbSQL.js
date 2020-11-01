import * as SQLite from 'expo-sqlite';


const db= SQLite.openDatabase('driverDetail');

export const initDb= ()=>{
    const promise= new Promise((resolve,reject)=>{
        db.transaction(cr=>{
            cr.executeSql('create table if not exists dora(id integer not null primary key, driverFirstName VARCHAR(100) not null, driverLastName VARCHAR(100) not null ,driverCarName VARCHAR(20) not null, driverCarModel VARCHAR(5) not null, driverLicensePlate VARCHAR(15) not null, driverCarColor VARCHAR(15) not null, completed BOOLEAN)',
            [],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            }
            )
        })
    })
    return promise
}
 
export const insertDriverDetails=(driverFirstName, driverLastName, driverCarName, driverCarModel, driverLicensePlate,driverCarColor,completed)=>{
    const promise= new Promise((resolve, reject)=>{
        db.transaction(ins=>{
            ins.executeSql('insert into dora(driverFirstName, driverLastName, driverCarName, driverCarModel, driverLicensePlate,driverCarColor,completed) values(?,?,?,?,?,?,?)',
            [driverFirstName, driverLastName, driverCarName, driverCarModel, driverLicensePlate,driverCarColor,completed],
            (_,result)=>{
                resolve(result)
            },
            (_,err)=>{
                reject(err)
            }
            )
        })
    })
    return promise
}

export const fetchDriverData=()=>{
    const promise= new Promise((resolve, reject)=>{
        db.transaction(fet=>{
            fet.executeSql('select * from dora',
            [],
            (_,res)=>{
                resolve(res)
            },
            (_,err)=>{
                reject(err)
            }
            )
        })
    })
    return promise
}