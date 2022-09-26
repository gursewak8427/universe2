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
import './topic.css'

function TopicManage() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const { topicsList } = useSelector((state) => state.main)
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/topic/`, config).then(response => {
            const responseData = response.data;
            console.log("toicss list")
            console.log(responseData)
            dispatch(setTopics(responseData))
        }).catch(err => {
            console.log(err)
        })


    }, [])

    const columns = [
        { title: "Topic ID", field: "tableData.id", render: (item) => getIndex(item) },
        { title: "Name", field: "Topicname", render: (item) => getName(item) },
        { title: "Class-Subject", field: "subject", render: (item) => <>{item.class_name.class_name}({item.subject.subject})</> },
        { title: "Timing", field: "timing", render: (item) => <>{item.timing} min</> },
        { title: "Clue", field: "status", render: (item) => getClueStatus(item) },
        { title: "Status", field: "status", render: (item) => getStatus(item) },
        { title: "Calculator", field: "status", render: (item) => getCalculatorStatus(item) },
        { title: "Created/Updated", field: "updated", render: (item) => getCreatedUpdated(item) },
    ];

    const getCreatedUpdated = (item) => {
        const createdAt = new Date(item.created_at);
        const udpatedAt = new Date(item.updated_at);

        return (
            <>
                <span className="text-secondary">{`(${createdAt.toLocaleString()})`}</span>
                <span className="text-primary">{`(${udpatedAt.toLocaleString()})`}</span>
            </>
        )
    }

    const getName = (item) => {
        return <>
            <span>{item.Topicname}</span>
            {/* <div className="d-flex align-items-center justify-center">
                {
                    item.calculatorStatus ?
                        <img className="m-2" style={{ width: "15px" }} src={require("./calculator.png")} alt="" /> :
                        <></>
                }
            </div> */}
        </>
    }

    const getClueStatus = (item) => {
        var index = item.tableData.id;
        function onchange() {
            // set status for topics
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            const updatedData = {
                "Topicname": item.Topicname,
                "description": item.description,
                "numberofquestions": item.numberofquestions,
                "timing": item.timing,
                "calculatorStatus": item.calculatorStatus,
                "clueStatus": !item.clueStatus,
                "Teacher": item.Teacher,
                "status": item.status,
                "subject": item.subject.id,
                "class_name": item.class_name.id,
            }
            axios.put(`${process.env.REACT_APP_API_URI}exams/topic/${item.id}/`, updatedData, config).then(response => {
                let oldData = topicsList
                console.log(response.data)
                oldData[index] = response.data;
                dispatch(setTopics(oldData))
                dispatch(setSuccessMsg("Clue Status Changed"))
            }).catch(err => {
                console.log(err)
            })
        }
        return (
            <>
                {
                    item.clueStatus ?
                        <Switch onClick={onchange} name="clueStatus" checked/> :
                        <Switch onClick={onchange} name="clueStatus"/>

                }
            </>
        )
    }


    const getCalculatorStatus = (item) => {
        var index = item.tableData.id;
        function onchange() {
            // set status for topics
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            const updatedData = {
                "Topicname": item.Topicname,
                "description": item.description,
                "numberofquestions": item.numberofquestions,
                "timing": item.timing,
                "calculatorStatus": !item.calculatorStatus,
                "Teacher": item.Teacher,
                "status": item.status,
                "subject": item.subject.id,
                "class_name": item.class_name.id,
            }
            axios.put(`${process.env.REACT_APP_API_URI}exams/topic/${item.id}/`, updatedData, config).then(response => {
                let oldData = topicsList
                console.log(response.data)
                oldData[index] = response.data;
                dispatch(setTopics(oldData))
                dispatch(setSuccessMsg("Calculator Status Changed"))
            }).catch(err => {
                console.log(err)
            })
        }
        return (
            <>
                {
                    item.calculatorStatus ?
                        <Switch onClick={onchange} name="calculator" checked /> :
                        <Switch onClick={onchange} name="calculator" />

                }
            </>
        )
    }


    const getStatus = (item) => {
        var index = item.tableData.id;
        function onchange() {
            // set status for topics
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            const updatedData = {
                "Topicname": item.Topicname,
                "description": item.description,
                "numberofquestions": item.numberofquestions,
                "timing": item.timing,
                "calculatorStatus": item.calculatorStatus,
                "Teacher": item.Teacher,
                "status": !item.status,
                "subject": item.subject.id,
                "class_name": item.class_name.id,
            }
            axios.put(`${process.env.REACT_APP_API_URI}exams/topic/${item.id}/`, updatedData, config).then(response => {
                let oldData = topicsList
                console.log(response.data)
                oldData[index] = response.data;
                dispatch(setTopics(oldData))
                dispatch(setSuccessMsg("Topic Status Changed"))
            }).catch(err => {
                console.log(err)
            })
        }
        return (
            <>
                {
                    item.status ?
                        <Switch onClick={onchange} name="calculator" checked /> :
                        <Switch onClick={onchange} name="calculator" />

                }
            </>
        )
    }

    const getIndex = data => {
        var index = data.tableData.id + 1;
        return <>
            <div className="d-flex align-items-center justify-center">
                {
                    index < 10 ?
                        "#0" + index :
                        "#" + index
                }
                {
                    data.calculatorStatus ?
                        <img className="m-2" style={{ width: "15px" }} src={require("./calculator.png")} alt="" /> :
                        <></>
                }
            </div>
        </>
    }

    const actions = [
        {
            icon: EditIcon,
            tooltip: "Update",
            onClick: (event, rowData) => updadteTopicNow(rowData),
        },
        {
            icon: DeleteIcon,
            tooltip: "Delete Driver",
            onClick: (event, rowData) => deleteTopic(rowData),
        },
    ];

    const deleteTopic = rowData => {
        var index = rowData.tableData.id
        if (window.confirm("Are you sure to delte this topic ?")) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            let oldData = topicsList
            oldData.splice(index, 1)
            dispatch(setTopics(oldData))
            dispatch(setSuccessMsg("Topic Deleted Successfully"))
            axios.delete(`${process.env.REACT_APP_API_URI}exams/topic/${rowData.id}/`, config).then(response => {
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const updadteTopicNow = (rowData) => {
        history.push('/in/update_topic/' + rowData.id);
    }

    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Heading headingTitle="Topic Managent" addTopicBtn={true} />
                <div className="mt-2">
                    <div className="mt-2 card_box modifiedSwitch">
                        <MaterialTable
                            options={{
                                actionsColumnIndex: -1,
                                paginationType: "stepped",
                                exportButton: true
                            }}
                            localization={{
                                header: {
                                    actions: 'ACTION'
                                },
                            }}
                            data={topicsList}
                            columns={columns && columns}
                            title=""
                            // onRowClick={(event, rowData) => console.log(rowData)}
                            actions={actions && actions}
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}


export default TopicManage;
