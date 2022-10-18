import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from "../../components/Sidebar/Sidebar";
import { setCurrentUpdatedHappyHour, setGlobalImage, setSuccessMsg, setTopics } from '../../../../../services/actions/mainAction';
import { useStyles } from "../../../../../utils/useStyles";
import Heading from "../../components/Heading/Heading";
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';
import { NumericKeyboard } from 'react-numeric-keyboard';

// katex
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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
        numericAnswer: "",
        isSubmit: false,
    })

    useEffect(() => {
        // STEP-1: get topics data from the API here and store to data variable..
        axios.get(`${process.env.REACT_APP_API_URI}guest/previewsubquestion/?subquestion=${id}`).then(response => {
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
        if (state.isSubmit) return
        setState({
            ...state,
            singleAnswer: e.target.value
        })
    }
    const onChangeKeypad = ({ value, name }) => {
        if (state.isSubmit) return
        console.log([value, name]);

        if (name == "Backspace") {
            setState({
                ...state,
                numericAnswer: state.numericAnswer.slice(0, -1)
            })
            return;
        }
        setState({
            ...state,
            numericAnswer: state.numericAnswer + name
        })
    };
    const handleMultiAnswer = (e) => {
        if (state.isSubmit) return
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

    const getRightOrWrong = (optionNumber) => {
        if (state.isSubmit == false) return ""
        var AnswerArr = state.questionDetail.Answer.split(",")

        if (state.questionDetail.QuestionType == "0") {

            if (AnswerArr[optionNumber] == "true") {
                return <span className='m-2 text-success'>Right</span>
            } else {
                if (state.singleAnswer == optionNumber) {
                    return <span className='m-2 text-danger'>Wrong</span>
                } else {
                    return ""
                }
            }
        }

        if (state.questionDetail.QuestionType == "1") {
            if (AnswerArr[optionNumber] == "true") {
                return <span className='m-2 text-success'>Right</span>
            } else {
                if (optionNumber == 0 && state.Op1 == true) return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 1 && state.Op2 == true) return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 2 && state.Op3 == true) return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 3 && state.Op4 == true) return <span className='m-2 text-danger'>Wrong</span>
            }
        }
    }

    const submitAnswer = () => {
        if (state.isSubmit) return
        setState({
            ...state,
            isSubmit: true,
        })
        var AnswerArr = state.questionDetail.Answer.split(",")
        if (state.questionDetail.QuestionType == "0") {
            if (AnswerArr[parseInt(state.singleAnswer)] == "true") {
                // alert("Your answer is Right")
            } else {
                // alert("Your answer is Wrong")
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
                // alert("Your answer is Right")
            } else {
                // alert("Your answer is Wrong")
            }
        }
        if (state.questionDetail.QuestionType == "2") {
            console.log(state)
            var rangeMax = parseFloat(state.questionDetail.Rangemax);
            var rangeMin = parseFloat(state.questionDetail.Rangemin);
            var correctAnswer = parseFloat(state.questionDetail.CorrectAnswer);

            if (parseFloat(state.numericAnswer) == correctAnswer) {
                // alert("Your answer is absolute correct")
            } else if (parseFloat(state.numericAnswer) <= rangeMax && parseFloat(state.numericAnswer) >= rangeMin) {
                // alert("Your answer is correct")
            } else {
                // alert("Your answer is wrong")
            }
        }
    }


    const getNumericResult = () => {
        var rangeMax = parseFloat(state.questionDetail.Rangemax);
        var rangeMin = parseFloat(state.questionDetail.Rangemin);
        var correctAnswer = parseFloat(state.questionDetail.CorrectAnswer);

        if (parseFloat(state.numericAnswer) == correctAnswer) {
            return true;
        } else if (parseFloat(state.numericAnswer) <= rangeMax && parseFloat(state.numericAnswer) >= rangeMin) {
            return true;
        } else {
            return false;
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
                                        <div className="question"><span className="text-primary">Question:</span> <br /> {state.questionDetail.Question.split("$k$").map((data, index) => {
                                            if (index % 2 == 1) {
                                                return <InlineMath math={data} />
                                            } else {
                                                return data
                                            }
                                        })}</div>
                                        <div className="m-2">
                                            {
                                                state.questionDetail.QuestionImage != null ?
                                                    <span className='viewImagetxt' onClick={() => dispatch(setGlobalImage(state.questionDetail.QuestionImage))}>View Image</span> : <></>
                                            }
                                            {/* {
                                                state.questionDetail.QuestionImage == null ? <></> :
                                                    <a href={state.questionDetail.QuestionImage} target="blank"><img src={state.questionDetail.QuestionImage} alt="" width={"100px"} /></a>
                                            } */}
                                        </div>
                                        <div className="m-2">
                                            <hr />
                                            <b className='text-primary'>Single Correct Answer</b>
                                        </div>
                                        <div className="options">
                                            <li>
                                                <input type="radio" name='singleCheckAnswer' id='op1' onChange={handleSingleAnswer} value="0" />
                                                <label htmlFor="op1">{state.questionDetail.Option1.split("$k$").map((data, index) => {
                                                    if (index % 2 == 1) {
                                                        return <InlineMath math={data} />
                                                    } else {
                                                        return data
                                                    }
                                                })}</label>
                                                {getRightOrWrong(0)}
                                                {
                                                    state.questionDetail.Option1Image != null ?
                                                        <span className='viewImagetxt' onClick={() => dispatch(setGlobalImage(state.questionDetail.Option1Image))}>View Image</span> : <></>
                                                }
                                                {/* {
                                                    state.questionDetail.Option1Image ?
                                                        <>
                                                            <a href={state.questionDetail.Option1Image} target="blank"><img src={state.questionDetail.Option1Image} alt="" width={"50px"} /></a>
                                                        </> : <></>
                                                } */}
                                            </li>
                                            {
                                                state.questionDetail.Option2 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op2' onChange={handleSingleAnswer} value="1" />
                                                        <label htmlFor="op2">{state.questionDetail.Option2.split("$k$").map((data, index) => {
                                                            if (index % 2 == 1) {
                                                                return <InlineMath math={data} />
                                                            } else {
                                                                return data
                                                            }
                                                        })}</label>
                                                        {getRightOrWrong(1)}
                                                        {/* {
                                                            state.questionDetail.Option2Image ?
                                                                <>
                                                                    <a href={state.questionDetail.Option2Image} target="blank"><img src={state.questionDetail.Option2Image} alt="" width={"50px"} /></a>
                                                                </> : <></>
                                                        } */}
                                                        {
                                                            state.questionDetail.Option2Image != null ?
                                                                <span className='viewImagetxt' onClick={() => dispatch(setGlobalImage(state.questionDetail.Option2Image))}>View Image</span> : <></>
                                                        }
                                                    </li> : <></>
                                            }
                                            {
                                                state.questionDetail.Option3 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op3' onChange={handleSingleAnswer} value="2" />
                                                        <label htmlFor="op3">{state.questionDetail.Option3.split("$k$").map((data, index) => {
                                                            if (index % 2 == 1) {
                                                                return <InlineMath math={data} />
                                                            } else {
                                                                return data
                                                            }
                                                        })}</label>
                                                        {getRightOrWrong(2)}
                                                        {/* {
                                                            state.questionDetail.Option3Image ?
                                                                <>
                                                                    <a href={state.questionDetail.Option3Image} target="blank"><img src={state.questionDetail.Option3Image} alt="" width={"50px"} /></a>
                                                                </> : <></>
                                                        } */}
                                                        {
                                                            state.questionDetail.Option3Image != null ?
                                                                <span className='viewImagetxt' onClick={() => dispatch(setGlobalImage(state.questionDetail.Option3Image))}>View Image</span> : <></>
                                                        }
                                                    </li> : <></>
                                            }
                                            {
                                                state.questionDetail.Option4 != "" ?
                                                    <li>
                                                        <input type="radio" name='singleCheckAnswer' id='op4' onChange={handleSingleAnswer} value="3" />
                                                        <label htmlFor="op4">{state.questionDetail.Option4.split("$k$").map((data, index) => {
                                                            if (index % 2 == 1) {
                                                                return <InlineMath math={data} />
                                                            } else {
                                                                return data
                                                            }
                                                        })}</label>
                                                        {getRightOrWrong(3)}
                                                        {
                                                            state.questionDetail.Option4Image != null ?
                                                                <span className='viewImagetxt' onClick={() => dispatch(setGlobalImage(state.questionDetail.Option4Image))}>View Image</span> : <></>
                                                        }
                                                        {/* {
                                                            state.questionDetail.Option4Image ?
                                                                <>
                                                                    <a href={state.questionDetail.Option4Image} target="blank"><img src={state.questionDetail.Option4Image} alt="" width={"50px"} /></a>
                                                                </> : <></>
                                                        } */}
                                                    </li> : <></>
                                            }


                                        </div>
                                        <button className='btn btn-success m-2' onClick={submitAnswer}>Submit Answer</button>
                                        {
                                            true ?
                                                <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#myModal">Hint</button>
                                                : <></>
                                        }
                                    </div> :
                                    state.questionDetail.QuestionType == 1 ?
                                        <div>
                                            <div className="question"> <span className="text-primary">Question:</span> <br /> {state.questionDetail.Question.split("$k$").map((data, index) => {
                                                if (index % 2 == 1) {
                                                    return <InlineMath math={data} />
                                                } else {
                                                    return data
                                                }
                                            })}</div>
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
                                                    <label htmlFor="op1">{state.questionDetail.Option1.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                    {getRightOrWrong(0)}
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
                                                            <label htmlFor="op2">{state.questionDetail.Option2.split("$k$").map((data, index) => {
                                                                if (index % 2 == 1) {
                                                                    return <InlineMath math={data} />
                                                                } else {
                                                                    return data
                                                                }
                                                            })}</label>
                                                            {getRightOrWrong(1)}
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
                                                            <label htmlFor="op3">{state.questionDetail.Option3.split("$k$").map((data, index) => {
                                                                if (index % 2 == 1) {
                                                                    return <InlineMath math={data} />
                                                                } else {
                                                                    return data
                                                                }
                                                            })}</label>
                                                            {getRightOrWrong(2)}
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
                                                            <label htmlFor="op4">{state.questionDetail.Option4.split("$k$").map((data, index) => {
                                                                if (index % 2 == 1) {
                                                                    return <InlineMath math={data} />
                                                                } else {
                                                                    return data
                                                                }
                                                            })}</label>
                                                            {getRightOrWrong(3)}
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
                                            {
                                                true ?
                                                    <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#myModal">Hint</button>
                                                    : <></>
                                            }
                                        </div> :
                                        <div>
                                            <div className="question"> <span className="text-primary">Question:</span> <br /> {state.questionDetail.Question.split("$k$").map((data, index) => {
                                                if (index % 2 == 1) {
                                                    return <InlineMath math={data} />
                                                } else {
                                                    return data
                                                }
                                            })}</div>
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
                                                <input type="text" placeholder='Type answer from keypad below' className='form-control' name='numericAnswer'
                                                    value={state.numericAnswer}
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
                                            {
                                                true ?
                                                    <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#myModal">Hint</button>
                                                    : <></>
                                            }
                                            <br />
                                            {
                                                state.isSubmit ?
                                                    getNumericResult() ?
                                                        <div className='text-success m-2'>
                                                            <b>Your answer is Right</b>
                                                        </div> :
                                                        <div className='text-danger m-2'>
                                                            <b>Your answer is Wrong</b>
                                                            <br />
                                                            <b className='text-info'>Correct Answer : {state.questionDetail.CorrectAnswer}</b>
                                                        </div> : <></>

                                            }


                                        </div>
                        }
                        {
                            state.isSubmit ?
                                <div className="SolutionDiv m-2">
                                    <h3 className="text-dark">
                                        <b>Solution: </b>
                                    </h3>
                                    {
                                        state.questionDetail ? state.questionDetail.SolutionImage ?
                                            <a href={state.questionDetail.SolutionImage}><img src={state.questionDetail.SolutionImage} alt="" /></a> : <></> : <></>
                                    }
                                    <p className='mt-3'>{state.questionDetail ? state.questionDetail.Solution.split("$k$").map((data, index) => {
                                        if (index % 2 == 1) {
                                            return <InlineMath math={data} />
                                        } else {
                                            return data
                                        }
                                    }) : ""}</p>
                                </div> : <></>
                        }

                    </div>

                </main>
            </div>

            <div id="myModal" class="modal fade" role="dialog">
                <div class="modal-dialog">

                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Question Hint</h4>
                        </div>
                        <div class="modal-body">
                            <p>{state.questionDetail ? state.questionDetail.Clue.split("$k$").map((data, index) => {
                                if (index % 2 == 1) {
                                    return <InlineMath math={data} />
                                } else {
                                    return data
                                }
                            }) : <>Nothing</>}</p>
                            {state.questionDetail ? state.questionDetail.ClueImage ? <img src={state.questionDetail.ClueImage} alt="" /> : <></> : <></>}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Preview;