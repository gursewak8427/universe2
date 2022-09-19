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

function Preview() {
    const { admin } = useSelector((state) => state.auth);
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const { topicsList, chaptersList, classesList, subjects_list } = useSelector((state) => state.main)
    const [state, setState] = useState({
        questionDetail: null,
        singleAnswer: null,
    })

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        axios.get(`${process.env.REACT_APP_API_URI}guest/previewsubquestion/?subquestion=${id}`, config).then(response => {
            setState({
                ...state,
                questionDetail: response.data[0]
            })
            console.log(response.data[0])
        }).catch(err => {
            console.log(err)
        })


    }, [])

    const handleSingleAnswer = (e) => {
        setState({
            ...state,
            singleAnswer: e.target.value
        })
    }

    const submitAnswer = () => {
        var AnswerArr = state.questionDetail.Answer.split(",")
        if (state.questionDetail.QuestionType == "0") {
            if (AnswerArr[parseInt(state.singleAnswer)] == "true") {
                alert("Your answer is Right")
            } else {
                alert("Your answer is Wrong")
            }
        }
    }

    return (
        <div>
            <div className={classes.root}>
                <main className={classes.content}>
                    <div id='previewPage'>

                        {
                            !state.questionDetail ? <>Loading...</> :
                                state.questionDetail.QuestionType == 0 ?
                                    <div>
                                        <div className="question">{state.questionDetail.Question}</div>
                                        <div className="m-2">
                                            <img src={state.questionDetail.QuestionImage} alt="" width={"100px"} />
                                        </div>
                                        <div className="m-2">
                                            <hr />
                                            <h2>Please Select One Option</h2>
                                        </div>
                                        <div className="options">
                                            <li>
                                                <input type="radio" name='singleCheckAnswer' id='op1' onChange={handleSingleAnswer} value="0" />
                                                <label htmlFor="op1">{state.questionDetail.Option1}</label>
                                                {
                                                    state.questionDetail.Option1Image ?
                                                        <>
                                                            <img src={state.questionDetail.Option1Image} alt="" width={"50px"} />
                                                        </> : <></>
                                                }
                                            </li>
                                            {
                                                state.questionDetail.Option2 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op2' onChange={handleSingleAnswer} value="1" />
                                                        <label htmlFor="op2">{state.questionDetail.Option2}</label>
                                                        {
                                                            state.questionDetail.Option2Image ?
                                                                <>
                                                                    <img src={state.questionDetail.Option2Image} alt="" width={"50px"} />
                                                                </> : <></>
                                                        }
                                                    </li> : <></>
                                            }
                                            {
                                                state.questionDetail.Option3 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op3' onChange={handleSingleAnswer} value="2" />
                                                        <label htmlFor="op3">{state.questionDetail.Option3}</label>
                                                        {
                                                            state.questionDetail.Option3Image ?
                                                                <>
                                                                    <img src={state.questionDetail.Option3Image} alt="" width={"50px"} />
                                                                </> : <></>
                                                        }
                                                    </li> : <></>
                                            }
                                            {
                                                state.questionDetail.Option4 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op4' onChange={handleSingleAnswer} value="3" />
                                                        <label htmlFor="op4">{state.questionDetail.Option4}</label>
                                                        {
                                                            state.questionDetail.Option4Image ?
                                                                <>
                                                                    <img src={state.questionDetail.Option4Image} alt="" width={"50px"} />
                                                                </> : <></>
                                                        }
                                                    </li> : <></>
                                            }


                                        </div>
                                        <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                    </div> :
                                    state.questionDetail.QuestionType == 1 ?
                                        <div>
                                            <div className="question">This is the question</div>
                                            <div className="options">
                                                <li>
                                                    <input type="checkbox" name='multiCheckAnswer' />
                                                    <label htmlFor="">op1</label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name='multiCheckAnswer' />
                                                    <label htmlFor="">op1</label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name='multiCheckAnswer' />
                                                    <label htmlFor="">op1</label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name='multiCheckAnswer' />
                                                    <label htmlFor="">op1</label>
                                                </li>
                                            </div>
                                            <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                        </div> :
                                        <div>
                                            <div className="question">This is the question</div>
                                            <div className="answer m-2">
                                                <input type="text" placeholder='Type Answer Here...' className='form-control' />
                                            </div>
                                            <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                        </div>
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Preview;