import React, { forwardRef, useEffect, useState } from "react";
import Heading from "../../components/Heading/Heading";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './getTest.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMsg, setTopics } from "../../../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";


function GetTest() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const { topicsList } = useSelector((state) => state.main)
    const history = useHistory();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        pageNo: 1,
        classList: [],
        subjectList: [],
        mainTopicList: [],
        chaptersList: [],
        selectedTopic: {},

        chooseChapterId: [],
        ChtopicsList: [],
        topicList: [],
    })
    const config = {
        headers: {
            'Authorization': `Bearer ${admin.token}`
        }
    }
    useEffect(() => {
        console.log(admin)
        console.log("admin")
        // STEP-1: get topics data from the API here and store to data variable..
        axios.get(`${process.env.REACT_APP_API_URI}students/class/`, config).then(response => {
            const classData = response.data;
            console.log(classData)
            setState({
                ...state,
                classList: classData
            })
        }).catch(err => console.log(err))
    }, [])
    const selectClass = (classData) => {
        axios.get(`${process.env.REACT_APP_API_URI}students/subject/?class_name=${classData.id}`, config).then(response => {
            const subjectData = response.data;
            console.log(subjectData)
            setState({
                ...state,
                subjectList: subjectData,
                pageNo: 2,
            })

        }).catch(err => console.log(err))

    }

    const selectSubject = (subjectData) => {
        // get chapters
        https://celatomuniverse.com/students/chapter/?class_name=1&subject=1 
        axios.get(`${process.env.REACT_APP_API_URI}students/chapter/?class_name=${subjectData.class_name}&subject=${subjectData.id}`, config).then(response => {
            const chapterdata = response.data;
            console.log(chapterdata)

            // get main topics same
            axios.get(`${process.env.REACT_APP_API_URI}students/maintopic/?class_name=${subjectData.class_name}&subject=${subjectData.id}`, config).then(response => {
                const mainTopicData = response.data;
                console.log(mainTopicData)
                setState({
                    ...state,
                    mainTopicList: mainTopicData,
                    chaptersList: chapterdata,
                    pageNo: 3,
                })
            }).catch(err => console.log(err))

        }).catch(err => console.log(err))
    }

    const selectCHchapter = (chapterdata, index) => {
        // get chapters
        // https://celatomuniverse.com/students/maintopic/?id=2
        // https://celatomuniverse.com/students/chapter/?class_name=1&subject=1 

        setState({
            ...state,
            chooseChapterId: index,
            pageNo: 31,
        })

    }


    const selectCHmaintopic = (maintopicdata, index) => {
        // get chapters
        // https://celatomuniverse.com/students/maintopic/?id=2
        // https://celatomuniverse.com/students/chapter/?class_name=1&subject=1 
        setState({
            ...state,
            chooseMainTopicId: index,
            pageNo: 32,
        })
    }


    const selectMainTopicToGetTopics = (maintopicdata, index) => {
        // get main topics same
        axios.get(`${process.env.REACT_APP_API_URI}students/maintopic/?id=${maintopicdata.topic.id}`, config).then(response => {
            const mainTopicData = response.data;
            console.log("mainTopicData to get topics")
            console.log(mainTopicData)
            setState({
                ...state,
                topicList: mainTopicData,
                pageNo: 33,
            })
        }).catch(err => console.log(err))
    }

    const selectTopic = (topicData) => {
        console.log("topicData that selected")
        console.log(topicData)
        setState(({
            ...state,
            pageNo: 4,
            selectedTopic: topicData
        }))
    }

    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Heading />
                <div className="mt-2">
                    <div className="mt-2 card_box">
                        {/* here is the content */}
                        {
                            state.pageNo == 1 ?
                                <>
                                    <div className="chooseClassSubject">
                                        <h1>Choose Your Class/Exam</h1>
                                        <div className="data_grid">
                                            {
                                                state.classList.map(classData => {
                                                    return (
                                                        <div className="data_grid_box" onClick={() => selectClass(classData)}>
                                                            <h5>Class</h5>
                                                            <p>{classData.class_name}</p>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </> :
                                state.pageNo == 2 ?
                                    <>
                                        <div className="chooseClassSubject">
                                            <h1>Choose Your Subject</h1>
                                            <div className="data_grid">

                                                {
                                                    state.subjectList.map(subjectData => {
                                                        return (
                                                            <div className="data_grid_box" onClick={() => selectSubject(subjectData)}>
                                                                <h5>Subject</h5>
                                                                <p>{subjectData.subject}</p>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </> :
                                    state.pageNo == 3 ?
                                        <>
                                            <div className="chooseClassSubject topicChapter col-12">
                                                <div className="col-6">
                                                    <h1>Choose Chapter</h1>
                                                    <div className="data_grid">
                                                        {
                                                            state.chaptersList.map((chapterdata, index) => {
                                                                return (
                                                                    <li onClick={() => selectCHchapter(chapterdata, index)}>
                                                                        {chapterdata.chaptername}
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <h1>Choose Main Topic</h1>
                                                    <div className="data_grid">
                                                        {
                                                            state.mainTopicList.map((maintopicdata, index) => {
                                                                return (
                                                                    <li onClick={() => selectCHmaintopic(maintopicdata, index)}>
                                                                        {maintopicdata.topicname}
                                                                    </li>
                                                                    // <div className="data_grid_box" onClick={() => selectTopic(topicData)}>
                                                                    // </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>

                                            </div>
                                        </> : state.pageNo == 31 ?
                                            <>
                                                <div className="chooseClassSubject">
                                                    <h1>Main Topics List</h1>
                                                    <div className="data_grid">

                                                        {
                                                            state.chaptersList[state.chooseChapterId].maintopics.map((maintopicdata, index) => {
                                                                return (
                                                                    <div className="data_grid_box" onClick={() => selectMainTopicToGetTopics(maintopicdata)}>
                                                                        <h5>Main Topic</h5>
                                                                        <p>{maintopicdata.topic.topicname || "MT=" + maintopicdata.topic.id}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </> : state.pageNo == 32 ?
                                                <>
                                                    <div className="chooseClassSubject">
                                                        <h1>Topics List</h1>
                                                        <div className="data_grid">
                                                            {
                                                                state.mainTopicList[state.chooseMainTopicId].topic.map(topicdata => {
                                                                    return (
                                                                        <div className="outerTextBox">
                                                                            <div className="testBOx" onClick={() => selectSubject(topicdata)}>
                                                                                <div>
                                                                                    <h5>Grade</h5>
                                                                                    <p>{topicdata.topic.class_name.class_name}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <h5>Subject</h5>
                                                                                    <p>{topicdata.topic.subject.subject}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <h5>Topic</h5>
                                                                                    <p>{topicdata.topic.Topicname}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <h5>Time</h5>
                                                                                    <p>{topicdata.topic.timing} min</p>
                                                                                </div>
                                                                            </div>
                                                                            <center><button className="btn" onClick={() => selectTopic(topicdata)}>Start Test</button></center>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                    </div>
                                                </> : state.pageNo == 33 ?
                                                    <>
                                                        <div className="chooseClassSubject">
                                                            <h3 className="col-12">Just Click And Start Your Test Journey Now <br /> With CelatomUniverse</h3>
                                                            <div className="data_grid">
                                                                {
                                                                    state.topicList[0].topic.map(topicdata => {
                                                                        return (
                                                                            <div className="outerTextBox">
                                                                                <div className="testBOx" onClick={() => selectSubject(topicdata)}>
                                                                                    <div>
                                                                                        <h5>Grade</h5>
                                                                                        <p>{topicdata.topic.class_name.class_name}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5>Subject</h5>
                                                                                        <p>{topicdata.topic.subject.subject}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5>Topic</h5>
                                                                                        <p>{topicdata.topic.Topicname}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5>Time</h5>
                                                                                        <p>{topicdata.topic.timing} min</p>
                                                                                    </div>
                                                                                </div>
                                                                                <center><button className="btn" onClick={() => selectTopic(topicdata)}>Start Test</button></center>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </div>
                                                        </div>
                                                    </> :
                                                    state.pageNo == 4 ?
                                                        <>
                                                            <div className="selectedTopicDetails">
                                                                <div className="left">
                                                                    <div className="dtl_box">
                                                                        <h6>Topic Name:</h6>
                                                                        <p>{state.selectedTopic.topic.Topicname}</p>
                                                                    </div>
                                                                    <div className="dtl_box">
                                                                        <h6>Subject:</h6>
                                                                        <p>{state.selectedTopic.topic.subject.subject}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <div>
                                                                        <div className="dtl_box">
                                                                            <h6>Candidate Name/ID:</h6>
                                                                            <p>{`${admin.data.first_name} ${admin.data.last_name}/${admin.data.id}`}</p>
                                                                        </div>
                                                                        <div className="dtl_box">
                                                                            <h6>Time:</h6>
                                                                            <p>{state.selectedTopic.topic.timing} min</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="imgBox">
                                                                        <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=486" alt="" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <center>
                                                                <button className="startBtnTest" onClick={() => {
                                                                    history.push(`/student/start/${state.selectedTopic.topic.id}`)
                                                                }}>Start</button>
                                                            </center>
                                                        </>
                                                        : <></>
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}


export default GetTest;
