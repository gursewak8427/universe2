import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import './InternalTeacher.css';
import { useDispatch } from "react-redux";
import { setErrorMsg, setSuccessMsg } from "../../../services/actions/mainAction";
import { authenticate } from "../../../helper/Cookies";

function InternalTeacherSignUp() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        fname: "",
        lname: "",
        phone: "",
        email: "",
        password: "",
        confPass: "",
        keepMe: false,
        isSubmit: false,
    })

    const registerNow = async () => {
        setState({ ...state, isSubmit: true, })
        if (state.fname == "" || state.lname == "" || state.phone == "" || state.email == "" || state.password == "" || state.confPass == "") {
            dispatch(setErrorMsg("Please fill all fields"))
            return;
        }
        if (state.password !== state.confPass) {
            dispatch(setErrorMsg("Both Passwords should be same"))
            return;
        }
        try {
            var data = {
                email: state.email,
                first_name: state.fname,
                last_name: state.lname,
                mobile_number: state.phone,
                password: state.password,
                password2: state.confPass
            }
            axios.post(process.env.REACT_APP_API_URI + "accounts/internalteacherregister/", data).then(response => {

                dispatch(setSuccessMsg("Register Successfully"))
                setState({ ...state, isSubmit: false, })
                setTimeout(() => {
                    window.location.href = "/internal_teacher_login";
                }, 500);

            }).catch(err => {
                setState({ ...state, isSubmit: false, })
                dispatch(setErrorMsg("Register Failed"));
                console.log(err);
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
                    <h1>Sign Up</h1>
                    <p>Existing user? <Link to="/internal_teacher_login">Login Here.</Link></p>
                    <div className="input_row">
                        <label htmlFor="">First Name</label>
                        <input type="text" name="fname" onChange={onchange} value={state.fname} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Last Name</label>
                        <input type="text" name="lname" onChange={onchange} value={state.lname} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Phone Number</label>
                        <input type="text" name="phone" onChange={onchange} value={state.phone} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Email</label>
                        <input type="text" name="email" onChange={onchange} value={state.email} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Password</label>
                        <input type="text" name="password" onChange={onchange} value={state.password} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Confirm Password</label>
                        <input type="text" name="confPass" onChange={onchange} value={state.confPass} />
                    </div>
                    <div className="input_row">
                        <input type="checkbox" name="" id="" />
                        <p>By signing up you agree to recieve updates and special offers.</p>
                    </div>
                    <button className="btn submitBtn" onClick={registerNow}>Submit</button>
                </div>
                <div className="right">
                    <img src={require("./sideImage.png")} />
                </div>
            </div>
        </>
    );
}

export default InternalTeacherSignUp;
