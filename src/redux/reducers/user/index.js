import { setAuthToken } from "../../../config/api";
import * as TYPE from "../../type/user";

const initialState = {
  loading: true,
  data: false,
  errorMessage: false,
};

const User = (state = initialState, { type, payload }) => {
  switch (type) { 
    case TYPE.LOGIN :
        setAuthToken(payload.token)
        return {
            ...state,
            loading : payload.loading, 
            data : payload.data,
            errorMessage : payload.errorMessage
        }

    case TYPE.UPDATE_USER :
        
    default:
      return state;
  }
};


export default User