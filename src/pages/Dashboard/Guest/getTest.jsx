import React, { forwardRef, useEffect, useState } from "react";
import { useStyles } from "../../../utils/useStyles";
import axios from "axios";
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";
import { setGuestTopic } from "../../../services/actions/mainAction";


function GetTestGuest() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        topicList: [],
    })
    useEffect(() => {
        console.log(admin)
        console.log("admin")
        // STEP-1: get topics data from the API here and store to data variable..
        axios.get(`${process.env.REACT_APP_API_URI}guest/guesttopics/`).then(response => {
            const topicdata = response.data;
            console.log("#topicdata")
            setState({
                ...state,
                topicList: topicdata
            })
        }).catch(err => console.log(err))
    }, [])



    const startTest = (topicData) => {
        dispatch(setGuestTopic(topicData))
        history.push(`/guest/questions/${topicData.id}`)
    }

    return (
        <div className={classes.root}>
            {/* <Sidebar /> */}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {/* <Heading /> */}
                <div className="mt-2">
                    <div className="mt-2 card_box">
                        {/* here is the content */}
                        <div className="chooseClassSubject">
                            <h3 className="col-12">Just Click And Start Your Test Journey Now <br /> With CelatomUniverse</h3>
                            <div className="data_grid">
                                {
                                    state.topicList.map(topicdata => {
                                        return (
                                            <div className="outerTextBox">
                                                <div className="testBOx">
                                                    <div>
                                                        <h5>Grade</h5>
                                                        <p>{topicdata.class_name.class_name}</p>
                                                    </div>
                                                    <div>
                                                        <h5>Subject</h5>
                                                        <p>{topicdata.subject.subject}</p>
                                                    </div>
                                                    <div>
                                                        <h5>Topic</h5>
                                                        <p>{topicdata.Topicname}</p>
                                                    </div>
                                                    <div>
                                                        <h5>Time</h5>
                                                        <p>{topicdata.timing} min</p>
                                                    </div>
                                                </div>
                                                <center><button className="btn" onClick={() => startTest(topicdata)}>Start Test</button></center>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


export default GetTestGuest;
