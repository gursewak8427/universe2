import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { loginAction, setErrorMsg, setSuccessMsg } from "../services/actions/mainAction";
import { useDispatch } from "react-redux";
import { authenticate } from "../helper/Cookies";

function ForgotPassword() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: "",
        isSubmit: false,
    })

    const forgotPasswordApi = async () => {
        if (state.email == "") {
            dispatch(setErrorMsg("Please fill all fields"))
            return;
        }

        setState({ ...state, isSubmit: true, })
        try {
            const { email } = state

            var data = {
                email: email,
            }
            axios.post(process.env.REACT_APP_API_URI + "accounts/forgot-password/", data).then(response => {

                console.log(response)
                dispatch(setSuccessMsg("Forgot password link send successfully to email"))
                setState({ ...state, isSubmit: false, })

            }).catch(err => {
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
                    <h1>Forgot Password</h1>
                    <div className="input_row">
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder="Enter your email here" onChange={onchange} value={state.email} name="email" />
                    </div>
                    <div className="input_row">
                        <span>
                            <span><Link to={"/student_login"}>Student Login</Link></span>
                            <br />
                            <big><b><Link to={"/internal_teacher_login"}>Internal Teacher Login</Link></b></big>
                        </span>
                    </div>
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

export default ForgotPassword;
