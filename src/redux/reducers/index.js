import { combineReducers } from "redux";

import trip from "./trip";
import user from "./user"

export default combineReducers({
  trip,
  user
});
