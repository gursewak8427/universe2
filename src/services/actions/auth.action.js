import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { authenticate, removeAuthentication } from "../../helper/Cookies";
import { setErrorMsg, setSuccessMsg } from "./mainAction";
import { LOGIN } from "../constants/AuthConstants";


export const loginNow = (data) => async (dispatch) => {
  dispatch({ type: LOGIN, payload: { "token": data.token, "data": data.tokenData } });
};

export const logoutAction = () => async (dispatch) => {
  removeAuthentication(() => {
    dispatch(setSuccessMsg("Logout Successfully"))
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  })
};
