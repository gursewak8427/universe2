import React, { useEffect, useState } from "react";
import { useStyles } from "../../../utils/useStyles";
import axios from "axios";
import Sidebar from "./components/Sidebar/Sidebar";
import './dashboard.css'

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useSelector } from "react-redux";


function StudentDashboard() {
    const classes = useStyles();
    const [isWait, setWait] = useState(false);
    const { admin } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log("admin")
        console.log(admin)
    },[])
    
    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />

                {/* box 1 */}
                <div className="top-row">
                    <h1>Welcome! Shubham</h1>
                    <div className="box1">
                        <div className="left">
                            <div className="a">
                                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" alt="" />
                                <p>Add/Edit your photo</p>
                            </div>
                            <div className="b">
                                <p>{admin.data.first_name} {admin.data.last_name}</p>
                                <p>(ID : {admin.data.id})</p>
                            </div>
                        </div>
                        <div className="right">
                            <p>Email ID : &nbsp; {admin.data.email}</p>
                            <p>Class : &nbsp; 9th Standard</p>
                            <p>Subscription : &nbsp; Paid Subscription</p>
                        </div>
                    </div>
                </div>

                {/* box 1 */}
                <div className="box2">
                    <div className="left">
                        <h3>A New Different Way to Improve Your
                            Skills.</h3>
                        <p>Start Studying Today And Level Up Your Knowledge.....</p>
                    </div>
                    <div className="right">
                        <img src={require("./vr_ar.png")} alt="" />
                    </div>
                </div>

            </main>
        </div>
    );
}

export default StudentDashboard;
