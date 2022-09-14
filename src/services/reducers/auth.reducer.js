import { LOGIN, LOGOUT } from "../constants/AuthConstants";

const initialState = {
  admin: null,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {

    case LOGIN:
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
      };

    case LOGOUT:
      return {
        ...state,
        admin: '',
        isAuthenticated: false,
      }

    default:
      return state;

  }
};
