import React, { forwardRef, useEffect, useState } from "react";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './MainTopic.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Heading from "../../components/Heading/Heading";
import { useDispatch, useSelector } from "react-redux";
import { setSuccessMsg } from "../../../../../services/actions/mainAction";


function MainTopic() {
    const classes = useStyles();
    const history = useHistory();
    const { admin } = useSelector((state) => state.auth)
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/maintopic/`, config).then(response => {
            const responseData = response.data;
            console.log("responseData main topics");
            console.log(responseData);
            setData(responseData)
        }).catch(err => console.log(err))
    }, [])

    const columns = [
        { title: "Main Topic ID", field: "tableData.id", render: (item) => getIndex(item) },
        { title: "Main Topic", field: "topicname" },
        { title: "Description", field: "discription" },
        { title: "Classes", field: "topics", render: (item) => getClassList(item) },
        { title: "Subjects", field: "topics", render: (item) => getSubjectList(item) },
        { title: "Topics", field: "topics", render: (item) => getTopicList(item) },
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
        return <ul>
            {item.classes.map((classData) => <li>{classData.class.class_name}</li>)}
        </ul>
    }
    const getSubjectList = (item) => {
        return <ul>
            {item.subjects.map((classData) => <li>{classData.subject.subject}</li>)}
        </ul>
    }
    const getTopicList = (item) => {
        return <ul>
            {item.topics.map((classData) => <li>{classData.topic.Topicname}</li>)}
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
            onClick: (event, rowData) => deleteMainTopic(rowData),
        },
    ];

    const deleteMainTopic = rowData => {
        var index = rowData.tableData.id
        if (window.confirm("Are you sure to delete this main topic ?")) {
            let oldData = data
            oldData.splice(index, 1)
            setData(oldData)
            dispatch(setSuccessMsg("Main Topic Deleted Successfully"))
            axios({
                method: 'delete',
                url: `${process.env.REACT_APP_API_URI}exams/maintopic/`,
                data: {
                    id: rowData.id
                },
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }).then(response => {
            });
        }
    }


    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Heading headingTitle="Main Topics Management" addMainTopicBtn={true} />
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

            </main>
        </div>
    );
}


export default MainTopic;
