import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import './InternalTeacher.css';
import { loginAction, setErrorMsg, setSuccessMsg } from "../../../services/actions/mainAction";
import { useDispatch } from "react-redux";
import { authenticate } from "../../../helper/Cookies";

function InternalTeacherLogin() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: "",
        password: "",
        keepMe: false,
        isSubmit: false,
    })

    const loginNow = async () => {
        setState({ ...state, isSubmit: true, })
        if (state.email == "" || state.password == "") {
            dispatch(setErrorMsg("Please fill all fields"))
            return;
        }

        const e = "abc@gmail.com";
        const p = "1234";
        try {
            const { email, password, keepMe } = state

            var data = {
                email: email,
                password: password,
            }
            console.log(data)
            axios.post(process.env.REACT_APP_API_URI + "accounts/internalteacherlogin/", data).then(response => {

                const token = response.data.token;
                authenticate(token, () => {
                    dispatch(setSuccessMsg("Login Successfully"))
                    setState({ ...state, isSubmit: false, })
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500);
                })

            }).catch(err => {
                setState({ ...state, isSubmit: false, })
                dispatch(setErrorMsg("Login Failed"));
                console.log(err.message);
            })

        } catch (error) {
            setState({ ...state, isSubmit: false, })
            dispatch(setErrorMsg("Login Failed"));
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
                    <h1>Internal Teacher Login</h1>
                    <p>Not a user? <Link to="/internal_teacher_signup">Sign Up Here.</Link></p>
                    <div className="input_row">
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder="Enter your email here" onChange={onchange} value={state.email} name="email" />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Password</label>
                        <input type="password" placeholder="Enter your password here" onChange={onchange} value={state.password} name="password" />
                    </div>
                    <div className="input_row">
                        <span>Reset Password</span>
                    </div>
                    <button className="btn submitBtn b" onClick={() => loginNow()}>Sign In</button>
                </div>
                <div className="right">
                    <img src={require("./sideImage.png")} />
                </div>
            </div>
        </>
    );
}

export default InternalTeacherLogin;
