import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from "../../components/Sidebar/Sidebar";
import { setCurrentUpdatedHappyHour, setErrorMsg, setSuccessMsg, setTopics } from '../../../../../services/actions/mainAction';
import { useStyles } from "../../../../../utils/useStyles";
import Heading from "../../components/Heading/Heading";
import { Switch, TextareaAutosize } from '@mui/material';

function CreateTopic() {
    const { admin } = useSelector((state) => state.auth);
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const { topicsList, classesList, subjects_list } = useSelector((state) => state.main)
    const [state, setState] = useState({
        name: "",
        subject: "",
        description: "",
        n_questions: 0,
        class: "",
        status: false,
        time: "",
        calculatorStatus: false,
        updatedId: null
    })


    useEffect(() => {
      if (id) {
        // get detail with Id
        (async () => {

            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            axios.get(`${process.env.REACT_APP_API_URI}exams/topic/${id}/`, config).then(response => {
                const responseData = response.data;
                console.log("responseData topic")
                console.log(responseData)
                setState({
                    ...state,
                    name: responseData.Topicname,
                    subject: responseData.subject.id,
                    description: responseData.description,
                    n_questions: responseData.numberofquestions,
                    class: responseData.class_name.id,
                    status: responseData.status,
                    time: responseData.timing,
                    calculatorStatus: responseData.calculatorStatus,
                    updatedId: responseData,
                })
            }).catch(err => {
                console.log(err)
            })

        })();

      }
    }, [id])

    const onchange = e => {
        console.log([e.target.name, e.target.value])
        if (e.target.name == "calculator") {
            setState({
                ...state,
                calculatorStatus: !state.calculatorStatus
            })
        } else if (e.target.name == "status") {
            setState({
                ...state,
                status: !state.status
            })
        } else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }
    }


    // add topic data to server database
    const AddSP = async () => {
        console.log(state);
        if (state.name == "" || state.subject == "" || state.description == "" || state.n_questions == 0 || state.class == "") {
            dispatch(setErrorMsg("All Fields are required"))
        }

        var newData = {
            Topicname: state.name,
            description: state.description,
            subject: state.subject,
            numberofquestions: state.n_questions,
            class_name: state.class,
            timing: state.time,
            calculatorStatus: state.calculatorStatus,
            status: state.status,
        }

        // update
        if (state.updatedId) {
            var updatedData = {
                Teacher: state.updatedId.Teacher,
                Topicname: state.name,
                description: state.description,
                subject: state.subject,
                numberofquestions: state.n_questions,
                class_name: state.class,
                timing: state.time,
                calculatorStatus: state.calculatorStatus,
                status: state.status,
            }
    
            // add new 
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            axios.put(`${process.env.REACT_APP_API_URI}exams/topic/${state.updatedId.id}/`, updatedData, config).then(response => {
                dispatch(setSuccessMsg("Topic Updated Successfully"))
                history.push("/in/topics")
            }).catch(err => {
                console.log(err)
            })

        } else {

            // add new 
            const config = {
                headers: {
                    'Authorization': `Bearer ${admin.token}`
                }
            }
            axios.post(`${process.env.REACT_APP_API_URI}exams/topic/`, newData, config).then(response => {
                const responseData = response.data;
                console.log(response)
                let fullData = [newData, ...topicsList]
                dispatch(setTopics(fullData))
                dispatch(setSuccessMsg("Topic Added Successfully"))
                history.push("/in/topics")
            }).catch(err => {
                console.log(err)
            })

        }
    }


    return (
        <div>
            <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Heading headingTitle={state.updatedId ? "Update Topic" : "Add Topic"} />
                    <div className='card_box'>
                        <Form className="form_activity form_add_product row mt-4 row">

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Topic Name</Form.Label>
                                <InputGroup className="mb-2">
                                    <FormControl
                                        placeholder=""
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="text"
                                        name="name"
                                        value={state.name}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Discription</Form.Label>
                                <InputGroup className="mb-2">
                                    <textarea
                                        className='form-control'
                                        placeholder=""
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="text"
                                        name="description"
                                        value={state.description}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-6">
                                <Form.Label className="label_grey">Select Class</Form.Label>
                                <InputGroup className="mb-2">
                                    <select class="form-select" aria-label="Default select example" name="class" onChange={onchange}>
                                        <option selected value="">Select Class</option>
                                        {
                                            classesList.map(item => {
                                                if(item.id == state.class){
                                                    return <option selected value={item.id}>{item.class_name}</option>;
                                                }else{
                                                    return <option value={item.id}>{item.class_name}</option>;
                                                }
                                            })
                                        }
                                    </select>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-6 col-md-6">
                                <Form.Label className="label_grey">Select Subject</Form.Label>
                                <InputGroup className="mb-2">
                                    <select class="form-select" aria-label="Default select example" name="subject" onChange={onchange}>
                                        <option selected>Select Subject</option>
                                        {
                                            subjects_list.map(item => {
                                                if(item.id == state.subject){
                                                    return <option selected value={item.id}>{item.subject}</option>
                                                }else{
                                                    return <option value={item.id}>{item.subject}</option>
                                                }
                                            })
                                        }
                                    </select>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-6">
                                <Form.Label className="label_grey">Number of Qestions</Form.Label>
                                <InputGroup className="mb-2">
                                    <FormControl
                                        placeholder=""
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="number"
                                        name="n_questions"
                                        value={state.n_questions}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-6">
                                <Form.Label className="label_grey">Timing (minutes)</Form.Label>
                                <InputGroup className="mb-2">
                                    <FormControl
                                        placeholder=""
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="number"
                                        name="time"
                                        value={state.time}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Status</Form.Label>
                                <InputGroup className="mb-2">
                                    {
                                        state.status == true ?
                                        <Switch checked onClick={onchange} name="status" />:
                                        <Switch onClick={onchange} name="status" />

                                    }
                                </InputGroup>
                            </Form.Group>


                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Calculator Status</Form.Label>
                                <InputGroup className="mb-2">
                                {
                                        state.status == true ?
                                        <Switch onClick={onchange} name="calculator" /> :
                                        <Switch onClick={onchange} name="calculator" />

                                    }
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Button className='btn_save' onClick={AddSP}>
                                    {state.updatedId != null ? "Update" : "Add"}
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CreateTopic;