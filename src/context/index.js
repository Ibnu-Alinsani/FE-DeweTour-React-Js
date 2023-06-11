import { createContext, useReducer } from "react";
import { setAuthToken } from "../config/api";

export const UserContext = createContext()

const initialState = {
    isLogin : false,
    role : '',
    user : {},
}

const reducer = ( state, action ) => {
    const {type, payload} = action

    switch (type) {
        case "USER_SUCCESS" :
        case "LOGIN_SUCCESS" :

        localStorage.setItem("token", payload.token)
        setAuthToken(payload.token)
        
        return {
            isLogin: true,
            role: payload.role,
            user: payload
        }

        case "AUTH_ERROR":
        case "LOGOUT" :
            localStorage.removeItem("token")
            return {
                isLogin: false,
                user: {},
            }

        default :
            throw new Error()
    }
}

export const UserContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )
}