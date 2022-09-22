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
import { NumericKeyboard } from 'react-numeric-keyboard';

function Preview() {
    const [isOpenKeyboard, setIsOpenKeyboard] = useState(true);
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
        Op1: false,
        Op2: false,
        Op3: false,
        Op4: false,
        numericAnswer: ""
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
    const onChangeKeypad = ({ value, name }) => {
        setState({
            ...state,
            numericAnswer: state.numericAnswer + name
        })
    };
    const handleMultiAnswer = (e) => {
        if (e.target.name == "Op1") {
            setState({
                ...state,
                [e.target.name]: !state.Op1
            })
        }
        if (e.target.name == "Op2") {
            setState({
                ...state,
                [e.target.name]: !state.Op2
            })
        }
        if (e.target.name == "Op3") {
            setState({
                ...state,
                [e.target.name]: !state.Op3
            })
        }
        if (e.target.name == "Op4") {
            setState({
                ...state,
                [e.target.name]: !state.Op4
            })
        }
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
        if (state.questionDetail.QuestionType == "1") {
            console.log(state)
            console.log(AnswerArr)
            var overallResult = false;
            if (AnswerArr[0] == state.Op1.toString()) {
                if (AnswerArr[1] == state.Op2.toString()) {
                    if (AnswerArr[2] == state.Op3.toString()) {
                        if (AnswerArr[3] == state.Op4.toString()) {
                            overallResult = true;
                        }
                    }
                }
            }
            if (overallResult == true) {
                alert("Your answer is Right")
            } else {
                alert("Your answer is Wrong")
            }
        }
        if (state.questionDetail.QuestionType == "2") {
            console.log(state)
            var rangeMax = parseFloat(state.questionDetail.Rangemax);
            var rangeMin = parseFloat(state.questionDetail.Rangemin);
            var correctAnswer = parseFloat(state.questionDetail.CorrectAnswer);

            if (parseFloat(state.numericAnswer) == correctAnswer) {
                alert("Your answer is absolute correct")
            } else if (parseFloat(state.numericAnswer) <= rangeMax && parseFloat(state.numericAnswer) >= rangeMin) {
                alert("Your answer is correct")
            } else {
                alert("Your answer is wrong")
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
                                        <div className="question"><span className="text-primary">Question:</span> <br /> {state.questionDetail.Question}</div>
                                        <div className="m-2">
                                            {
                                                state.questionDetail.QuestionImage == null ? <></> :
                                                    <a href={state.questionDetail.QuestionImage} target="blank"><img src={state.questionDetail.QuestionImage} alt="" width={"100px"} /></a>
                                            }
                                        </div>
                                        <div className="m-2">
                                            <hr />
                                            <b className='text-primary'>Single Correct Answer</b>
                                        </div>
                                        <div className="options">
                                            <li>
                                                <input type="radio" name='singleCheckAnswer' id='op1' onChange={handleSingleAnswer} value="0" />
                                                <label htmlFor="op1">{state.questionDetail.Option1}</label>
                                                {
                                                    state.questionDetail.Option1Image ?
                                                        <>
                                                            <a href={state.questionDetail.Option1Image} target="blank"><img src={state.questionDetail.Option1Image} alt="" width={"50px"} /></a>
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
                                                                    <a href={state.questionDetail.Option2Image} target="blank"><img src={state.questionDetail.Option2Image} alt="" width={"50px"} /></a>
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
                                                                    <a href={state.questionDetail.Option3Image} target="blank"><img src={state.questionDetail.Option3Image} alt="" width={"50px"} /></a>
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
                                                                    <a href={state.questionDetail.Option4Image} target="blank"><img src={state.questionDetail.Option4Image} alt="" width={"50px"} /></a>
                                                                </> : <></>
                                                        }
                                                    </li> : <></>
                                            }


                                        </div>
                                        <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                    </div> :
                                    state.questionDetail.QuestionType == 1 ?
                                        <div>
                                            <div className="question"> <span className="text-primary">Question:</span> <br /> {state.questionDetail.Question}</div>
                                            <div className="m-2">
                                                {
                                                    state.questionDetail.QuestionImage == null ? <></> :
                                                        <a href={state.questionDetail.QuestionImage} target="blank"><img src={state.questionDetail.QuestionImage} alt="" width={"100px"} /></a>
                                                }
                                            </div>
                                            <div className="m-2">
                                                <hr />
                                                <b className='text-primary'>Multicorrect Answer</b>
                                            </div>
                                            <div className="options">
                                                <li>
                                                    <input type="checkbox" name='Op1' id='op1' onChange={handleMultiAnswer} value="0" />
                                                    <label htmlFor="op1">{state.questionDetail.Option1}</label>
                                                    {
                                                        state.questionDetail.Option1Image ?
                                                            <>
                                                                <a href={state.questionDetail.Option1Image} target="blank"><img src={state.questionDetail.Option1Image} alt="" width={"50px"} /></a>
                                                            </> : <></>
                                                    }
                                                </li>
                                                {
                                                    state.questionDetail.Option2 != "" ?
                                                        <li>
                                                            <input type="checkbox" name='Op2' id='op2' onChange={handleMultiAnswer} value="1" />
                                                            <label htmlFor="op2">{state.questionDetail.Option2}</label>
                                                            {
                                                                state.questionDetail.Option2Image ?
                                                                    <>
                                                                        <a href={state.questionDetail.Option2Image} target="blank"><img src={state.questionDetail.Option2Image} alt="" width={"50px"} /></a>
                                                                    </> : <></>
                                                            }
                                                        </li> : <></>
                                                }
                                                {
                                                    state.questionDetail.Option3 != "" ?
                                                        <li>
                                                            <input type="checkbox" name='Op3' id='op3' onChange={handleMultiAnswer} value="2" />
                                                            <label htmlFor="op3">{state.questionDetail.Option3}</label>
                                                            {
                                                                state.questionDetail.Option3Image ?
                                                                    <>
                                                                        <a href={state.questionDetail.Option3Image} target="blank"><img src={state.questionDetail.Option3Image} alt="" width={"50px"} /></a>
                                                                    </> : <></>
                                                            }
                                                        </li> : <></>
                                                }
                                                {
                                                    state.questionDetail.Option4 != "" ?
                                                        <li>
                                                            <input type="checkbox" name='Op4' id='op4' onChange={handleMultiAnswer} value="3" />
                                                            <label htmlFor="op4">{state.questionDetail.Option4}</label>
                                                            {
                                                                state.questionDetail.Option4Image ?
                                                                    <>
                                                                        <a href={state.questionDetail.Option4Image} target="blank"><img src={state.questionDetail.Option4Image} alt="" width={"50px"} /></a>
                                                                    </> : <></>
                                                            }
                                                        </li> : <></>
                                                }


                                            </div>
                                            <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                        </div> :
                                        <div>
                                            <div className="question"> <span className="text-primary">Question:</span> <br /> {state.questionDetail.Question}</div>
                                            <div className="m-2">
                                                {
                                                    state.questionDetail.QuestionImage == null ? <></> :
                                                        <a href={state.questionDetail.QuestionImage} target="blank"><img src={state.questionDetail.QuestionImage} alt="" width={"100px"} /></a>
                                                }
                                            </div>
                                            <div className="m-2">
                                                <hr />
                                                <b className='text-primary'>Numeric Answer Type</b>
                                            </div>
                                            <div className="answer m-2">
                                                <input type="number" placeholder='Type Answer Here...' className='form-control' name='numericAnswer' onChange={
                                                    (e) => {
                                                        setState({
                                                            ...state,
                                                            numericAnswer: e.target.value
                                                        })
                                                    }
                                                }
                                                    value={parseFloat(state.numericAnswer)}
                                                    readOnly
                                                />
                                            </div>
                                            <NumericKeyboard isOpen={isOpenKeyboard} onChange={onChangeKeypad} leftIcon={<div className='dotStyle' onClick={() => {
                                                setState({
                                                    ...state,
                                                    numericAnswer: state.numericAnswer + "."
                                                })
                                            }}>.</div>} />
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