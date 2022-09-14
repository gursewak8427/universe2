import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from "../../components/Sidebar/Sidebar";
import { setCurrentUpdatedHappyHour, setSuccessMsg, setTopics } from '../../../../../services/actions/mainAction';
import { useStyles } from "../../../../../utils/useStyles";
import Heading from "../../components/Heading/Heading";
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';

function SelectTopic() {
    const { admin } = useSelector((state) => state.auth);
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const { topicsList, chaptersList, classesList, subjects_list } = useSelector((state) => state.main)
    const [state, setState] = useState({
        myTopicsList: [],
        selectedValue: [],
        myTopic: null
    })

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}exams/topic/`, config).then(response => {
            const responseData = response.data;
            dispatch(setTopics(responseData))
            getMyTopics(responseData)
        }).catch(err => {
            console.log(err)
        })


    }, [])

   

    // useEffect(() => {
    //   if (id) {
    //     // get detail with Id
    //     var bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), '#fasi23123sabcc;[],.,.,.,,,kkl');
    //     var phone = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    //     (async () => {

    //       // get detail with phone
    //       const q = query(collection(FireDB, "ServiceProvider"), where("phone", "==", phone));
    //       const querySnapshot = await getDocs(q);
    //       let usersLength = querySnapshot.docs.length
    //       if (usersLength == 0) {
    //         alert("No Provider Found")
    //         return;
    //       }
    //       const userData = querySnapshot.docs[0].data()

    //       setState({
    //         ...state,
    //         name: userData.name,
    //         service: userData.service || "",
    //         earning: userData.earning || 0,
    //         address: userData.location || "",
    //         phone: userData.phone || "",
    //         payout: userData.payout || 0,
    //         updatedId: true,
    //       })
    //     })();

    //   }
    // }, [id])

    const getMyTopics = (responseData) => {
        // getTopic with classname and subject name
        let mytopics = []
        responseData.map((topic, index) => {
            console.log({
                label: topic.Topicname,
                value: topic.id
            })
            mytopics.push({
                label: topic.Topicname,
                value: topic.id
            })

            // console.log("topic")
            // console.log(topic)
            // console.log("state")
            // console.log(state)
            // if (topic.topic_class == state.class) {
            //     if (topic.subject == subject) {
            //         console.log('im here 2')
            //         console.log(topic)
            //     }
            // }

            if (index + 1 == responseData.length) {
                setState({
                    ...state,
                    myTopicsList: mytopics
                })

            }

        })

        console.log(topicsList)
        console.log("im here")
    }

    const onchange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
        if (e.target.name == "subject") {
            getMyTopics(e.target.value);
        }
    }



    const onSelect = (selectedList, selectedItem) => {
        console.log([selectedList, selectedItem])

        setState({
            ...state,
            myTopic: selectedItem
        })
    }

    const onRemove = (selectedList, selectedItem) => {
        return;
    }
    // add happy hour
    const AddSP = async () => {
        console.log(state)
        // if (state.topic == "") {
        //     alert("All Fields are required");
        //     return;
        // }
        // const data = {
        //     "name": state.name,
        //     "subject": state.subject,
        // }
        history.push("/in/add_test_que/" + state.myTopic)
        // update
        // if (state.updatedId) {
        //   await updateDoc(doc(FireDB, "ServiceProvider", state.phone), data);
        //   dispatch(setSuccessMsg("Updated Successfully"))
        //   history.push("/service_provider")
        // } else {
        //   // add new 
        //   await setDoc(doc(FireDB, "ServiceProvider", "+91" + state.phone), data);
        //   dispatch(setSuccessMsg("Added Successfully"))
        //   history.push("/service_provider")
        // }
    }


    return (
        <div>
            <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Heading headingTitle={"Select Topic"} />
                    <div className='card_box'>
                        <Form className="form_activity form_add_product row mt-4 row">
                            {/* <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Class</Form.Label>
                                <InputGroup className="mb-2">
                                    <select class="form-select" aria-label="Default select example" name="class" onChange={onchange}>
                                        <option selected>Select Class</option>
                                        {
                                            classesList.map(item => (
                                                <option value={item.class}>{item.class}</option>
                                            ))
                                        }
                                    </select>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Subject</Form.Label>
                                <InputGroup className="mb-2">
                                    <select class="form-select" aria-label="Default select example" name="subject" onChange={onchange}>
                                        <option selected>Select Subject</option>
                                        {
                                            subjects_list.map(item => (
                                                <option value={item.subject}>{item.subject}</option>
                                            ))
                                        }
                                    </select>
                                </InputGroup>
                            </Form.Group> */}
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Topic</Form.Label>
                                <InputGroup className="mb-2">
                                    <Select
                                        className='col-6'
                                        options={state.myTopicsList}
                                        onChange={opt => {
                                            setState({
                                                ...state,
                                                myTopic: opt.value
                                            });
                                        }}
                                        isMulti={false}
                                    />
                                    {/* <select class="form-select" aria-label="Default select example">
                                        <option selected>Select Topic</option>
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
                                <Button className='btn_save' onClick={AddSP}>Next</Button>
                            </Form.Group>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default SelectTopic;