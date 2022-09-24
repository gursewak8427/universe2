import React, { forwardRef, useEffect, useState } from "react";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './chapter.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Heading from "../../components/Heading/Heading";
import { useSelector } from "react-redux";


function ChapterManage() {
    const classes = useStyles();
    const history = useHistory();
    const { admin } = useSelector((state) => state.auth)
    const [data, setData] = useState([]);
    const [modelData, setModelData] = useState({
        chapter: {},
        dataType: "",
        data: [],
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/chapter/`, config).then(response => {
            const responseData = response.data;
            console.log("responseData chapters");
            console.log(responseData);
            setData(responseData)
        }).catch(err => {
            console.log(err)
        })
    }

    const columns = [
        { title: "ID", field: "tableData.id", render: (item) => getIndex(item) },
        { title: "Chapter", field: "chaptername" },
        { title: "Description", field: "discription" },
        { title: "Classes", field: "topics", render: (item) => getClassList(item) },
        { title: "Subjects", field: "topics", render: (item) => getSubjectList(item) },
        { title: "Main Topics", field: "topics", render: (item) => getTopicList(item) },
        { title: "Created/Updated", field: "created_at", render: (item) => getCreatedUpdated(item) },
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


    const getClassList = (item) => {
        return <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#seeAllListModel" onClick={() => {
            setModelData({
                ...modelData,
                chapter: item,
                dataType: "CLASS",
                data: item.classes
            })
        }}>
            <span className="text-primary">Classes</span>
        </button>
        // return <ul>
        //     {item.classes.map((classData) => <li>{classData.class.class_name}</li>)}
        // </ul>
    }
    const getSubjectList = (item) => {
        return <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#seeAllListModel" onClick={() => {
            setModelData({
                ...modelData,
                chapter: item,
                dataType: "SUBJECT",
                data: item.subjects
            })
        }}>
            <span className="text-primary">Subjects</span>
        </button>
        return <ul>
            {item.subjects.map((classData) => <li>{classData.subject.subject}</li>)}
        </ul>
    }
    const getTopicList = (item) => {
        return <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#seeAllListModel" onClick={() => {
            setModelData({
                ...modelData,
                chapter: item,
                dataType: "TOPIC",
                data: item.maintopics
            })
        }}>
            <span className="text-primary">Topics</span>

        </button>
        return <ul>
            {item.maintopics.map((classData) => <li>{classData.topic.topicname}</li>)}
        </ul>
    }

    const getIndex = data => {
        var index = data.id
        return index;
    }


    const actions = [
        // {
        //     icon: EditIcon,
        //     tooltip: "Update",
        //     onClick: (event, rowData) => null,
        // },
        {
            icon: DeleteIcon,
            tooltip: "Delete Driver",
            onClick: (event, rowData) => null,
        },
    ];


    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Heading headingTitle="Chapter Management" addChapterBtn={true} />
                <div className="mt-2">
                    <div className="mt-2 card_box">
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
                            data={data}
                            columns={columns && columns}
                            title=""
                            onRowClick={(event, rowData) => console.log(rowData)}
                            actions={actions && actions}
                        />
                    </div>

                </div>

                <div class="modal fade hide " id="seeAllListModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-x">
                        <div class="modal-content">
                            <div class="modal-header">
                                Chapter Id : {modelData.chapter.id} <br />
                                Chapter Name : {modelData.chapter.chaptername}
                            </div>
                            <div class="modal-body">
                                <u><h6>
                                    {
                                        modelData.dataType == "CLASS" ? "Classes List" :
                                            modelData.dataType == "SUBJECT" ? "Subjects List" :
                                                modelData.dataType == "TOPIC" ? "Main Topics List" : ""
                                    }
                                </h6></u>
                                <ol>
                                    {
                                        modelData.data.map(listItem => {
                                            if (modelData.dataType == "CLASS") {
                                                return <li>{listItem.class.class_name} (Id : {listItem.class.id})</li>
                                            }
                                            if (modelData.dataType == "SUBJECT") {
                                                return <li>{listItem.subject.subject} (Id : {listItem.subject.id})</li>
                                            }
                                            if (modelData.dataType == "TOPIC") {
                                                return <li>{listItem.topic.topicname} (Id : {listItem.topic.id})</li>
                                            }
                                            return <li>{listItem}</li>
                                        })
                                    }
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}


export default ChapterManage;
