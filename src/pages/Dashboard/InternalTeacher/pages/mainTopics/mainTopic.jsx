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
import { useSelector } from "react-redux";


function MainTopic() {
    const classes = useStyles();
    const history = useHistory();
    const { topicsList, chaptersList, classesList, subjects_list } = useSelector((state) => state.main)

    const columns = [
        { title: "Main Topic ID", field: "tableData.id", render: (item) => getIndex(item) },
        { title: "Main Topic", field: "main_topic   " },
        { title: "Topics", field: "topics" },
        { title: "Created", field: "created" },
        { title: "Updated", field: "updated" },
    ];

    const getIndex = data => {
        var index = data.tableData.id + 1;
        if (index < 10) {
            return "#0" + index;
        } else {
            return "#" + index;
        }
    }


    const actions = [
        {
            icon: EditIcon,
            tooltip: "Update",
            onClick: (event, rowData) => null,
        },
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
                <Heading headingTitle="Main Topics Management" addMainTopicBtn={true}/>
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
                            data={chaptersList}
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
