import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from "../../components/Sidebar/Sidebar";
import { setChapters, setCurrentUpdatedHappyHour, setSuccessMsg } from '../../../../../services/actions/mainAction';
import { useStyles } from "../../../../../utils/useStyles";
import Heading from "../../components/Heading/Heading";
import { TextareaAutosize } from '@mui/material';
import Multiselect from 'multiselect-react-dropdown';

function CreateMainTopic() {
    const { admin } = useSelector((state) => state.auth);
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const { topicsList, chaptersList, classesList, subjects_list } = useSelector((state) => state.main)
    const [state, setState] = useState({
        classes_data: [],
        subjects: [],
        topics: [],
        maintopicname: "",
        description: "",

        myTopicsList: [],
        myClassList: [],
        mySubjectList: [],
        selectedValueClasses: [],
        selectedValueSubjects: [],
        selectedValueTopics: [],

        updatedId: null,
    })



    useEffect(() => {
        getClasses()
    }, [])

    const getClasses = () => {
        let myClasses = []
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/class/`, config).then(response => {

            const classesData = response.data;

            classesData.map((topic, index) => {
                myClasses.push({
                    name: topic.class_name,
                    id: topic.id
                })

                if (index + 1 == classesData.length) {
                    // alert(myClasses.length)
                    setState({
                        ...state,
                        myClassList: myClasses
                    })

                }

            })
        }).catch(err => {
            console.log(err)
        })

    }

    const getSubjects = (classess_data) => {

        let mySbjs = []
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/subject/`, config).then(response => {
            const subjectsData = response.data;
            subjectsData.map((subject, index) => {
                mySbjs.push({
                    name: `${subject.subject} / ${subject.class.class_name}`,
                    id: subject.id
                })
                if (index + 1 == subjectsData.length) {
                    setState({
                        ...state,
                        mySubjectList: mySbjs,
                        classes_data: classess_data

                    })
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }


    const onchange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }


    const getMyTopics = (dafasdf) => {
        // getTopic with classname and subject name
        let mytopics = []
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/topic/`, config).then(response => {
            const subjectsData = response.data;

            subjectsData.map((subject, index) => {
                mytopics.push({
                    name: subject.Topicname,
                    id: subject.id
                })
                if (index + 1 == subjectsData.length) {
                    setState({
                        ...state,
                        myTopicsList: mytopics,
                        subjects: dafasdf,

                    })
                }
            })
        }).catch(err => {
            console.log(err)
        })

    }

    const onSelectClass = (selectedList, selectedItem) => {
        console.log([selectedList, selectedItem])
        let finalClasses = []
        selectedList.map((item, index) => {
            finalClasses.push(item.id)
            if (index + 1 == selectedList.length) {
                getSubjects(finalClasses)
            }
        })
    }

    const onSelectSubject = (selectedList, selectedItem) => {
        console.log([selectedList, selectedItem])
        let finalSubjects = []
        selectedList.map((item, index) => {
            finalSubjects.push(item.id)
            if (index + 1 == selectedList.length) {
                getMyTopics(finalSubjects)
            }
        })
    }

    const onSelectTopics = (selectedList, selectedItem) => {
        console.log([selectedList, selectedItem])
        let finalSubjects = []
        selectedList.map((item, index) => {
            finalSubjects.push(item.id)
            if (index + 1 == selectedList.length) {
                setState({
                    ...state,
                    topics: finalSubjects
                })
            }
        })
    }

    // add happy hour
    const AddSP = async () => {

        // new mainTopic
        var newMainTopic = {
            topicname: state.maintopicname,
            discription: state.description,
            topics: state.topics,
            classes: state.classes_data,
            subjects: state.subjects,
        }

        // update
        if (state.updatedId) {
            // await updateDoc(doc(FireDB, "ServiceProvider", state.phone), data);
            // dispatch(setSuccessMsg("Updated Successfully"))
            // history.push("/service_provider")
        } else {
            // add new 
            axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URI}exams/maintopic/`,
                data: newMainTopic,
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }).then(response => {
                dispatch(setSuccessMsg("Main Topic Added Sucessufully"))
                history.push("/in/maintopics")
            });
        }
    }


    return (
        <div>
            <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Heading headingTitle={state.updatedId ? "Update Main Topic" : "Add Main Topic"} />
                    <div className='card_box'>
                        <Form className="form_activity form_add_product row row">
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Classes</Form.Label>
                                <InputGroup className="mb-2 col-12">
                                    <Multiselect
                                        className='topicSelectMulti col-12'
                                        options={state.myClassList} // Options to display in the dropdown
                                        selectedValues={state.selectedValueClasses} // Preselected value to persist in dropdown
                                        onSelect={onSelectClass} // Function will trigger on select event
                                        onRemove={onSelectClass} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                    {/* <select class="select" multiple data-mdb-filter="true">
                                        {
                                            state.myTopicsList.map(item =>
                                            (
                                                <option value={item.topic_name}>{item.topic_name}</option>
                                            ))
                                        }
                                    </select> */}
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Subjects</Form.Label>
                                <InputGroup className="mb-2">
                                    <Multiselect
                                        className='topicSelectMulti'
                                        options={state.mySubjectList} // Options to display in the dropdown
                                        selectedValues={state.selectedValueSubjects} // Preselected value to persist in dropdown
                                        onSelect={onSelectSubject} // Function will trigger on select event
                                        onRemove={onSelectClass} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                    {/* <select class="select" multiple data-mdb-filter="true">
                                        {
                                            state.myTopicsList.map(item =>
                                            (
                                                <option value={item.topic_name}>{item.topic_name}</option>
                                            ))
                                        }
                                    </select> */}
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Topics</Form.Label>
                                <InputGroup className="mb-2">
                                    <Multiselect
                                        className='topicSelectMulti'
                                        options={state.myTopicsList} // Options to display in the dropdown
                                        selectedValues={state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={onSelectTopics} // Function will trigger on select event
                                        onRemove={onSelectClass} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options
                                    />
                                    {/* <select class="select" multiple data-mdb-filter="true">
                                        {
                                            state.myTopicsList.map(item =>
                                            (
                                                <option value={item.topic_name}>{item.topic_name}</option>
                                            ))
                                        }
                                    </select> */}
                                </InputGroup>
                            </Form.Group>


                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Main Topic Name</Form.Label>
                                <InputGroup className="mb-2">
                                    <FormControl
                                        placeholder=""
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="text"
                                        name="maintopicname"
                                        value={state.maintopicname}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Description</Form.Label>
                                <InputGroup className="mb-2">
                                    <textarea
                                        className='form-control'
                                        placeholder="Write About Main Topic"
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="text"
                                        name="description"
                                        value={state.description}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Button className='btn_save' onClick={AddSP}>Save</Button>
                            </Form.Group>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CreateMainTopic;