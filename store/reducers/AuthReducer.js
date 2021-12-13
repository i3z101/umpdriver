const initiState= {
    idToken:null,
    userId:null,
    userMode:true,
    driverMode:false,
    typeOfUser:null,
    authError:null,
    errorStatus:false,
    userProfile:{},
    driverProfile:{},
    badge:0
}


  
const authReducer= (state=initiState, action)=>{
    switch(action.type){
        case 'USER_AUTH':
            return{
                ...state,
                idToken:action.idToken,
                userId: action.userId,
                userMode:true,
                typeOfUser: 'user',
                
            }
        case 'DRIVER_AUTH':
            return{
                ...state,
                idToken:action.idToken,
                userId: action.userId,
                userMode:false,
                typeOfUser:'driver',
                
            }
        case 'LOGOUT':
            return {
                idToken:null,
                userId:null,
                userMode:true,
                driverMode:false,
                typeOfUser:null,
                authError:null,
                errorStatus:false
            }
        case 'CHANGE_USER_MODE':
            return{
                ...state,
                userMode: !state.userMode
            }
        case 'AUTH_ERROR':
            return{
                ...state,
                userAuth:{
                    idToken:null,
                    userId:null,
                },
                driverAuth:{
                    idToken:null,
                    userId:null,
                },
                userMode:true,
                typeOfUser:null,
                errorStatus:!state.errorStatus,
                authError:'PLEASE CHECK THE PAGE'
            }
        case 'HIDE_ERROR':
            return{
                ...state,
                authError:null,
                errorStatus:!state.errorStatus
            }
        case 'AUTO_AUTH_USER':
            return{
                ...state,
                idToken:action.idToken,
                userId: action.userId,
                userMode:true,
                typeOfUser: 'user',
                badge: action.badge
                
            }
        case 'AUTO_AUTH_DRIVER':
            return{
                ...state,
                idToken:action.idToken,
                userId: action.userId,
                userMode:false,
                typeOfUser:'driver',
                
            }
        case 'DID_TRY':
            return{
                idToken:null,
                userId:null,
                userMode:true,
                driverMode:false,
                typeOfUser:null,
                authError:null,
                errorStatus:false
            }
        case 'ADD_USER_PROFILE':
                return{
                    ...state,
                   userProfile:action.userProfile
                }

        case 'ADD_DRIVER_PROFILE':
            return{
                ...state,
                driverProfile:action.driverProfile
            }
        case 'ADD_BADGE':
            return{
                ...state,
                userBadge: action.badge
            }
        default:
            return state
    }
}

export default authReducer