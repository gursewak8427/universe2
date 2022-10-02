import React, { forwardRef, useEffect, useState } from "react";
import Heading from "../../components/Heading/Heading";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import '../../dashboard.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMsg, setTopics } from "../../../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";


function OldTestResults() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [data, setData] = useState([])

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}students/examsubmit/`, config).then(response => {
            const responseData = response.data;
            console.log("Exam Results")
            console.log(responseData)
            setData(responseData)
        }).catch(err => {
            console.log(err)
        })


    }, [])

    const columns = [
        { title: "Test ID", field: "id", },
        { title: "Rank", field: "Topicname", render: (item) => <>-</> },
        { title: "Subject", field: "Topic.subject.subject" },
        { title: "Topic", field: "Topic.Topicname", },
        { title: "Total Marks", field: "timing", render: (item) => <>{item.resultMarks}/{item.totalMarks}</> },
        { title: "Test Preview", field: "updated", render: (item) => <button className="btn btn-primary">Preview</button> },
        { title: "", field: "updated", render: (item) => <button className="btn btn-primary">Reattempt</button> },
        { title: "", field: "updated", render: (item) => <button className="btn btn-primary">Reports</button> },
    ];

    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Heading headingTitle="Old Test Results" />
                <div className="mt-2">
                    <div className="mt-2 card_box">
                        <MaterialTable
                            options={{
                                actionsColumnIndex: -1,
                                paginationType: "stepped",
                                exportButton: false
                            }}
                            localization={{
                                header: {
                                    actions: 'ACTION'
                                },
                            }}
                            data={data}
                            columns={columns && columns}
                            title=""
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}


export default OldTestResults;
