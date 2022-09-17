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
        class: "",
        subject: "",
        topics: [],
        chapter_name: "",
        chapter_description: "",
        myTopicsList: [],
        selectedValue: [],
    })

    useEffect(() => {
        getMyTopics()
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

    const getMyTopics = () => {
        // getTopic with classname and subject name
        let mytopics = []
        topicsList.map((topic, index) => {
            mytopics.push({
                name: topic.topic_name,
                id: index
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

            // if (index + 1 == topicsList.length) {
            //     setState({
            //         ...state,
            //         myTopicsList: mytopics
            //     })

            // }

        })

        console.log(topicsList)
        console.log("im here")
    }

    const onchange = e => {

        if (e.target.name == "topics") {
            let selectedOptions = e.target.selectedOptions
            let newArrayOfSelectedOptionValues = Object.values(selectedOptions).map(
                opt => opt.value
            )
            setState({
                ...state,
                [e.target.name]: newArrayOfSelectedOptionValues
            })

        } else {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }

        if (e.target.name == "subject") {
            // getMyTopics(e.target.value);
        }
    }

    const onSelect = (selectedList, selectedItem) => {
        console.log([selectedList, selectedItem])
    }

    const onRemove = (selectedList, selectedItem) => {
        return;
    }


    // add happy hour
    const AddSP = async () => {
        console.log(state);

        // new chapter
        var newChapter = {
            chapter_name: state.chapter_name,
            topics: state.topics,
            subject: state.subject,
            class: state.class,
            chapter_description: state.chapter_description,
            created: "12 July, 2022 11:05 AM",
            updated: "",
        }

        // old
        var oldChapters = chaptersList

        dispatch(setChapters([newChapter, ...oldChapters]))
        dispatch(setSuccessMsg("Chapter Added Sucessufully"))
        history.push("/in/chapters")
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
                    <Heading headingTitle={state.updatedId ? "Update Main Topic" : "Add Main Topic"} />
                    <div className='card_box'>
                        <Form className="form_activity form_add_product row row">
                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Select Topics</Form.Label>
                                <InputGroup className="mb-2">
                                    <Multiselect
                                        className='topicSelectMulti'
                                        options={state.myTopicsList} // Options to display in the dropdown
                                        selectedValues={state.selectedValue} // Preselected value to persist in dropdown
                                        onSelect={onSelect} // Function will trigger on select event
                                        onRemove={onRemove} // Function will trigger on remove event
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
                                        name="chapter_name"
                                        value={state.chapter_name}
                                        onChange={onchange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-2 col-sm-12 col-md-12">
                                <Form.Label className="label_grey">Discription</Form.Label>
                                <InputGroup className="mb-2">
                                    <textarea
                                        className='form-control'
                                        placeholder="Write About Main Topic"
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        type="text"
                                        name="chapter_description"
                                        value={state.chapter_description}
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