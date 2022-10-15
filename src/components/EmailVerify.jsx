import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setGlobalImage, setSuccessMsg } from "../services/actions/mainAction";

const EmailVerify = () => {
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(window.location.search);

    const sendEmailVerifyRequest = () => {
        const token = queryParams.get('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        axios.post(`${process.env.REACT_APP_API_URI}accounts/email-verify/`, { token }, config).then(response => {
            const responseData = response.data;
            console.log(responseData)
            if (responseData.email) {
                dispatch(setSuccessMsg(responseData.email))
            }
            // update question number 
        }).catch(err => {
            if (err.response.data.messages) {
                if (err.response.data.messages[0].message) {
                    dispatch(setErrorMsg(err.response.data.messages[0].message))
                    return;
                }
            }
            dispatch(setErrorMsg("Something Wrong, Try again after sometime"))
            console.log(err)
        })
    }

    return <>
        <div className="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Celetom Universe</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="card bg-dark text-white">
            <img class="card-img" src="https://thumbs.dreamstime.com/b/welcome-banner-colorful-serpentine-welcome-banner-spruce-branches-colorful-paper-serpentine-vector-illustration-103884659.jpg" alt="Card image" />
        </div>
        <div class="card text-center">
            <div class="card-header">
                Email Verification
            </div>
            <div class="card-body">
                <p class="card-text">Please verify your email to login your account.</p>
                <a href="#" class="btn btn-success" onClick={sendEmailVerifyRequest}>Click Here to Verify Email</a>
            </div>
        </div>
    </>
}

export default EmailVerify;