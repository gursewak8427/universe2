import React, { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setSuccessMsg } from "../services/actions/mainAction";

const ToastHandler2 = () => {
  const dispatch = useDispatch();
  const { error_msg, success_msg } = useSelector((state) => state.main);

  useEffect(() => {
    if (error_msg != "") {
      toast.error(error_msg);
    }
    if (success_msg != "") {
      toast.success(success_msg);
    }

    dispatch(setSuccessMsg(""))
    dispatch(setErrorMsg(""))
  }, [error_msg, success_msg])

  return <>
    <Toaster
      position="top-right"
    />
  </>
}

export default ToastHandler2;