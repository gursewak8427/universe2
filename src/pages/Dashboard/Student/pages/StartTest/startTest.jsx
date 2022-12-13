import React, { forwardRef, useEffect, useState } from "react";
import Heading from "../../components/Heading/Heading";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './startTest.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMsg, setTopics } from "../../../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";
import ShortLoading from "../../components/ShortLoading/ShortLoading";


function StartTest() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { topicId } = useParams()
    const [state, setState] = useState({
        pageNo: 1,
        topicDetail: {},
        questionsList: [],
        shortLoading: true,
    })
    const config = {
        headers: {
            'Authorization': `Bearer ${admin.token}`
        }
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URI}students/class/`, config).then(response => {
            const classData = response.data;
            console.log(classData)
            setState({
                ...state,
                classList: classData,
                shortLoading: false,
            })
        }).catch(err => console.log(err))
    }, [])

    const ImReady = () => {
        history.push(`/student/questions/${topicId}`)
    }
    return (
        <div className={classes.root}>
            <Sidebar isSidebarShow={false} />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className="" id="startTest">
                    <div className="left">
                        {
                            // instructions
                            state.pageNo == 1 ?
                                <>
                                    <div className="content">
                                        <img src={require("./instructions.png")} alt="" />
                                        <button onClick={() => {
                                            setState({
                                                ...state,
                                                pageNo: 2,
                                            })
                                        }}>Next</button>
                                    </div>
                                </> :
                                // other instructions
                                state.pageNo == 2 ?
                                    <>
                                        <div className="content">
                                            <img src={require("./instructions2.png")} alt="" />
                                            <div className="bottomStartBtn">
                                                <div className="checkboxData">
                                                    <input type="checkbox" name="" id="accept" />
                                                    <label htmlFor="accept">
                                                        I have read and understood the instructions. I declare that i am not in possession of/not wearing/not carrying any prohibited gadget like mobile phone, bluetooth devices etc. / any prohibited material. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from
                                                        future Tests/Examinations.
                                                    </label>
                                                </div>
                                                <div className="row2">

                                                    <button onClick={() => {
                                                        setState({
                                                            ...state,
                                                            pageNo: 1,
                                                        })
                                                    }}>Previous</button>

                                                    <button onClick={ImReady}>I am Ready to begin</button>
                                                </div>
                                            </div>
                                        </div>
                                    </> :
                                    // questions test start
                                    state.pageNo == 3 ?
                                        <>
                                        </> : <></>

                        }
                    </div>
                </div>
            </main>
            {
                state.shortLoading ?
                <ShortLoading /> : <></>
            }
        </div>
    );
}


export default StartTest;
