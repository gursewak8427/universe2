import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { loginAction, setErrorMsg, setSuccessMsg } from "../services/actions/mainAction";
import { useDispatch } from "react-redux";
import { authenticate } from "../helper/Cookies";

function ForgotPassword2() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        pass1: "",
        pass2: "",
        isSubmit: false,
    })
    const queryParams = new URLSearchParams(window.location.search);
    const forgotPasswordApi = async () => {
        if (state.pass1 == "" || state.pass2 == "") {
            dispatch(setErrorMsg("Please fill all fields"))
            return;
        }

        if (state.pass1 != state.pass2) {
            dispatch(setErrorMsg("Both Passwords should be same"))
            return;
        }

        setState({ ...state, isSubmit: true, })
        try {
            const { pass1, pass2 } = state
            const token = queryParams.get('token');

            var data = {
                token,
                password: pass1,
                password2: pass2,
            }
            axios.post(process.env.REACT_APP_API_URI + "accounts/change-password/", data).then(response => {

                console.log(response)
                dispatch(setSuccessMsg("Password Changed Successfully"))
                setState({ ...state, isSubmit: false, })

            }).catch(err => {
                dispatch(setErrorMsg(err.response.data.error))
                setState({ ...state, isSubmit: false, })
            })

        } catch (error) {
            setState({ ...state, isSubmit: false, })
            dispatch(setErrorMsg("Something went wrong"));
        }

    }

    const onchange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }


    return (
        <>
            <div id="internalTeacher">
                <div className="left">
                    <h1>Set New Password
                        <button className="btn btn-secondary mx-4">
                            <Link to={"/"}>Home</Link>
                        </button>
                    </h1>
                    <div className="input_row">
                        <label htmlFor="">New Password</label>
                        <input type="text" placeholder="Enter new password" onChange={onchange} value={state.pass1} name="pass1" />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Confirm Password</label>
                        <input type="text" placeholder="Enter confirm password" onChange={onchange} value={state.pass2} name="pass2" />
                    </div>
                    {/* <div className="input_row">
                        <span>
                            <span><Link to={"/student_login"}>Student Login</Link></span>
                            <br />
                            <big><b><Link to={"/internal_teacher_login"}>Internal Teacher Login</Link></b></big>
                        </span>
                    </div> */}
                    <button className="btn submitBtn b" onClick={() => forgotPasswordApi()}>
                        {
                            state.isSubmit ?
                                <div class="spinner-border text-white" role="status"></div>
                                :
                                "Submit"
                        }
                    </button>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword2;
