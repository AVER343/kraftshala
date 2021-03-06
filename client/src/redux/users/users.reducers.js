import ACTION_TYPES from "./user.actions.types"

const INITIAL_STATE=null
const userReducer = (state=INITIAL_STATE,action)=>{
    switch(action.type)
    {
        case(ACTION_TYPES.LOGIN_SUCCESS):
            return {email:action.payload.user.email,name:action.payload.user.name,token:action.payload.token}
        case(ACTION_TYPES.LOGIN_FAILURE):
            return null
        case(ACTION_TYPES.LOGOUT):
            return null
        default:
            return state
    }
}
export default userReducer