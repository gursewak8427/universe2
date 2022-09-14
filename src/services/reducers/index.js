import { combineReducers } from "redux";
import { authReducer } from "./auth.reducer";
import { mainReducer } from "./main.reducer";

const rootReducer = combineReducers({
  main: mainReducer,
  auth: authReducer
});

export default rootReducer;
