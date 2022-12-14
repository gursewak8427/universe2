import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import './Student.css';
import { useDispatch } from "react-redux";
import { setErrorMsg, setSuccessMsg } from "../../../services/actions/mainAction";
import { authenticate } from "../../../helper/Cookies";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, app } from "../../../firebase-config";

function StudentSignUp() {
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
        phoneloading: false,
        emailloading: false,
    })
    const [otpval, setOtp] = useState({
        phone: "",
        email: "",
    })
    const [verification, setVerification] = useState({
        phone: false,
        email: true // always true, if otp is not send at email
    })

    const registerNow = async () => {
        if (verification.email == false || verification.phone == false) {
            dispatch(setErrorMsg("Please verify your phone"))
            return;
        }
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
            axios.post(process.env.REACT_APP_API_URI + "accounts/studentregister/", data).then(response => {

                dispatch(setSuccessMsg("Register Successfully"))
                setState({ ...state, isSubmit: false, })
                setTimeout(() => {
                    window.location.href = "/student_login";
                }, 500);

            }).catch(err => {
                if (err.response.data.email) {
                    dispatch(setErrorMsg("Email: " + err.response.data.email[0]));
                }
                if (err.response.data.password) {
                    dispatch(setErrorMsg("Password: " + err.response.data.password[0]));
                }
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


    const sendPhoneOTP = () => {
        if (verification.phone) return
        setState({
            ...state,
            phoneloading: true,
        })
        if (state.fname == "" || state.lname == "" || state.phone == "" || state.email == "" || state.password == "" || state.confPass == "") {
            dispatch(setErrorMsg("Please fill all fields"))
            return;
        }
        if (state.phone == "" || state.phone.length < 10) {
            dispatch(setErrorMsg("Phone number is not valid"))
            return;
        }
        if (state.password !== state.confPass) {
            dispatch(setErrorMsg("Both Passwords should be same"))
            return;
        }

        var regularExpressionStrongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if (!regularExpressionStrongPassword.test(state.password)) {
            dispatch(setErrorMsg("Please use Strong password"))
            return;
        }

        var phone = "+91" + state.phone
        // SEND OTP
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            }, auth);
        }
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phone, appVerifier).then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            dispatch(setSuccessMsg("OTP send to " + phone))
            setState({
                ...state,
                phoneloading: false,
            })
        }).catch((error) => {
            console.log(error);
        });
    }

    // for phone otp verification
    const getPhoneVerification = () => {
        if (verification.phone) return
        if (otpval.phone == "") {
            dispatch(setErrorMsg("Please Enter OTP"));
            return;
        }
        setState({
            ...state,
            phoneloading: true,
        })
        window.confirmationResult.confirm(otpval.phone).then((result) => {
            // User signed in successfully.
            const user = result.user;
            console.log(user)
            setState({
                ...state,
                phoneloading: false,
            })
            setVerification({
                ...verification,
                phone: true,
            })
            dispatch(setSuccessMsg("Phone number verified"))
        }).catch((error) => {
            console.log("usererr")
            dispatch(setErrorMsg("OTP verification failed, Please Enter OTP again"))
            setState({
                ...state,
                phoneloading: false,
            })
        });


    }

    // for email otp verification
    const getEmailVerification = () => {
        setVerification({
            ...verification,
            email: true,
        })
    }


    const verifierModel = () => {
        return <div class="modal fade" id="verifierModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Verification</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="verify_box">
                            <h3>
                                Enter the verification code we just
                                sent you on your mobile number.
                            </h3>
                            <input type="text" value={otpval.phone} placeholder="Enter Mobile OTP here" onChange={(e) => {
                                setOtp({
                                    ...otpval,
                                    phone: e.target.value
                                })
                            }} />
                            {
                                state.phoneloading ?
                                    <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> :
                                    <button onClick={getPhoneVerification} className={verification.phone ? "verifiedBtn" : ""}>{verification.phone ? "Verified" : "Verify"}</button>
                            }
                        </div>
                        {/* <div className="verify_box">
                            <h3>
                                Enter the verification code we just
                                sent you on your email ID.
                            </h3>
                            <input type="text" value={otpval.email} placeholder="Enter Email OTP here" onChange={(e) => {
                                setOtp({
                                    ...otpval,
                                    email: e.target.value
                                })
                            }} />
                            {
                                state.emailloading ?
                                    <div class="spinner-border" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> :
                                    <button onClick={getEmailVerification} className={verification.email ? "verifiedBtn" : ""}>{verification.email ? "Verified" : "Verify"}</button>
                            }
                        </div> */}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={registerNow}>
                            {
                                state.isSubmit ?
                                    <div class="spinner-border text-white" role="status"></div>
                                    :
                                    "Submit"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <>
            <div id="internalTeacher">
                <div className="left bigForm">
                    <h1>Student Register
                        <button className="btn btn-secondary mx-4">
                            <Link to={"/"}>Home</Link>
                        </button>
                    </h1>
                    <div className="one_row">
                        <div className="input_row">
                            <label htmlFor="">First Name</label>
                            <input type="text" name="fname" onChange={onchange} value={state.fname} />
                        </div>
                        <div className="input_row">
                            <label htmlFor="">Last Name</label>
                            <input type="text" name="lname" onChange={onchange} value={state.lname} />
                        </div>

                    </div>
                    <div className="input_row">
                        <label htmlFor="">Mobile Number</label>
                        <input type="text" name="phone" onChange={onchange} value={state.phone} />
                    </div>
                    <div className="input_row">
                        <label htmlFor="">Email ID</label>
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
                    <div className="input_row checkboxInput">
                        <input type="checkbox" name="" id="" />
                        <p>By signing up you agree to recieve updates and special offers.</p>
                    </div>
                    {/* so much for model opening */}
                    <div className="submit_row_signUP">

                        <p>Existing user? <Link to="/student_login">Login Here.</Link></p>
                        {
                            state.phone == "" || state.phone.length < 10 ||
                                state.fname == "" || state.lname == "" || state.phone == "" || state.email == "" || state.password == "" || state.confPass == "" ||
                                state.password !== state.confPass || !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(state.password) ?
                                <button className="btn submitBtn" onClick={sendPhoneOTP}>Submit</button> :
                                <button className="btn submitBtn" data-toggle="modal" data-target="#verifierModel" onClick={sendPhoneOTP}>Submit</button>
                        }
                    </div>


                </div>
                <div className="right bigForm">
                    <img src={require("./sideImage.png")} />
                </div>
            </div>
            <div id="recaptcha-container"></div>
            {verifierModel()}
        </>
    );
}

export default StudentSignUp;
