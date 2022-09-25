import React, { forwardRef, useEffect, useState } from "react";
import Heading from "../../components/Heading/Heading";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import './startTest.css'
import MaterialTable from "material-table";

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setSuccessMsg, setTopics } from "../../../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";


function Questions() {
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { topicId } = useParams()
    const [isWait, setWait] = useState(true)
    const [state, setState] = useState({
        topicDetail: {},
        questionsList: [],
        selectedQuestion: 0,
        selectedSubQuestion: {},
        questionAssigned: [],
    })

    const [currentAnswer, SetCurrentAnswer] = useState({
        AnswerArr: [false, false, false, false], // for multi
        CorrectAnswer: null, // for single and numeric is integer
    })

    const config = {
        headers: {
            'Authorization': `Bearer ${admin.token}`
        }
    }
    useEffect(() => {
        // get questionsList
        axios.get(`${process.env.REACT_APP_API_URI}students/topic/?id=${topicId}`, config).then(response => {
            const topicData = response.data;
            console.log("topicData")
            console.log(topicData)
            axios.get(`${process.env.REACT_APP_API_URI}students/question/?topic=${topicId}`, config).then(response => {
                var questiondata = response.data;
                // remove empty questions 
                const result = questiondata.filter((question) => question.subquestion.length > 0)
                assignQuestions(result, topicData)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }, [])

    const assignQuestions = (QuestionsData, topicData) => {
        let assignedQuestionsArray = []
        let ssQuestion = null
        QuestionsData.map((singleMainQuestionData, index) => {
            let ssStatus = 0;
            let SubQuestions = singleMainQuestionData.subquestion;
            if (SubQuestions.length != 0) {
                var SelectedSubQuestion = SubQuestions[Math.floor(Math.random() * SubQuestions.length)];
                if (index == 0) {
                    ssQuestion = SelectedSubQuestion;
                    ssStatus = 1;
                }
                console.log("SelectedSubQuestion")
                console.log(SelectedSubQuestion)
                assignedQuestionsArray.push({
                    mainQuestionData: singleMainQuestionData,
                    subQuestionData: SelectedSubQuestion,
                    questionType: SelectedSubQuestion.QuestionType,
                    submittedAnswerForSingle: null, // 0,1,2,3 integer (0-3)
                    submittedAnswerForMulti: null, // null or [true, false, true, false] array of booleans
                    submittedAnswerForNumeric: null, // integer
                    submittedStatus: ssStatus, // 0 == NotVisited (default), 1 == visited, 2 == MarkForReview
                })
            }
            if (QuestionsData.length == index + 1) {
                setState({
                    ...state,
                    topicDetail: topicData[0],
                    questionsList: QuestionsData,
                    selectedQuestion: 0,
                    selectedQuestionData: QuestionsData[0], // index of main question
                    selectedSubQuestion: ssQuestion, // self subquestion
                    questionAssigned: assignedQuestionsArray
                })
                setWait(false)
            }
        });
    }

    const markForReviewAndNext = () => {
        // savedata
        let oldQuestionResult = state.questionAssigned;
        if (oldQuestionResult[state.selectedQuestion].questionType == "0") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForSingle = currentAnswer.CorrectAnswer
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "1") {
            if (currentAnswer.AnswerArr[0] == false && currentAnswer.AnswerArr[1] == false && currentAnswer.AnswerArr[2] == false && currentAnswer.AnswerArr[3] == false) {
                oldQuestionResult[state.selectedQuestion].submittedAnswerForMulti = null
            } else {
                oldQuestionResult[state.selectedQuestion].submittedAnswerForMulti = currentAnswer.AnswerArr
            }
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "2") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForNumeric = currentAnswer.CorrectAnswer
        }
        oldQuestionResult[state.selectedQuestion].submittedStatus = 2

        if (state.questionAssigned.length == state.selectedQuestion + 1) {
            setState({
                ...state,
                questionAssigned: oldQuestionResult
            })
            dispatch(setErrorMsg("No More Questions"))
            return;
        } else {
        }

        let mainQuestionData = state.questionAssigned[state.selectedQuestion + 1].mainQuestionData
        let subQuestionData = state.questionAssigned[state.selectedQuestion + 1].subQuestionData
        oldQuestionResult[state.selectedQuestion + 1].submittedStatus = 1

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion + 1,
            selectedQuestionData: mainQuestionData,
            selectedSubQuestion: subQuestionData,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer({
            AnswerArr: [false, false, false, false], // for multi
            CorrectAnswer: null, // for single and numeric is integer
        })
    }

    const clearResponse = () => {
        // savedata
        let oldQuestionResult = state.questionAssigned;
        if (oldQuestionResult[state.selectedQuestion].questionType == "0") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForSingle = null
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "1") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForMulti = null
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "2") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForNumeric = null
        }
        setState({
            ...state,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer({
            ...currentAnswer,
            CorrectAnswer: null,
            AnswerArr: [false, false, false, false]
        })

        dispatch(setErrorMsg("Response Cleared"))
    }

    const NextQuestion = () => {

        // savedata
        let oldQuestionResult = state.questionAssigned;
        if (oldQuestionResult[state.selectedQuestion].questionType == "0") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForSingle = currentAnswer.CorrectAnswer
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "1") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForMulti = currentAnswer.AnswerArr
        }
        if (oldQuestionResult[state.selectedQuestion].questionType == "2") {
            oldQuestionResult[state.selectedQuestion].submittedAnswerForNumeric = currentAnswer.CorrectAnswer
        }

        if (state.questionAssigned.length == state.selectedQuestion + 1) {
            setState({
                ...state,
                questionAssigned: oldQuestionResult
            })
            dispatch(setErrorMsg("No More Questions"))
            return;
        } else {
        }

        let mainQuestionData = state.questionAssigned[state.selectedQuestion + 1].mainQuestionData
        let subQuestionData = state.questionAssigned[state.selectedQuestion + 1].subQuestionData
        oldQuestionResult[state.selectedQuestion + 1].submittedStatus = 1

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion + 1,
            selectedQuestionData: mainQuestionData,
            selectedSubQuestion: subQuestionData,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer({
            AnswerArr: [false, false, false, false], // for multi
            CorrectAnswer: null, // for single and numeric is integer
        })
    }
    const SelectQuestion = (QuestionIndex) => { }

    const fullResult = () => {
        console.log("Results : ")
        console.log(state.questionAssigned)
    }

    if (isWait) {
        return <div className="spinner"></div>
    }

    return (
        <div className={classes.root}>
            <div id="QuestionsPageId">

                <nav className="QuestionsPageNav">
                    <span>
                        <img src={"/assets/images/logo.png"} alt="" height={"60px"} />
                        <h6>CelatomUniverse</h6>
                    </span>
                    <i class="fa-solid fa-bars" onClick={() => {
                        document.getElementById("topicDtlId").classList.toggle("activeMobile")
                    }}></i>
                </nav>

                {/* topic details */}
                <div className="topicDtl" id="topicDtlId">
                    <div className="left">
                        Topic - {state.topicDetail.Topicname} (ID - {state.topicDetail.id})
                    </div>
                    <div className="right">
                        {
                            state.topicDetail.calculatorStatus ?
                                <span>
                                    <img src={require("./calculator.png")} alt="" />
                                    <span>Calculator</span>
                                </span> : <></>
                        }
                        <span>
                            <img src={require("./questionPaper.png")} alt="" />
                            <span>Question Paper</span>
                        </span>
                        <span>
                            <img src={require("./viewInstructions.png")} alt="" />
                            <span>View Instructions</span>
                        </span>
                    </div>
                </div>
                {/* end topic details */}

                {/* question row div */}
                <div id="mainDiv">
                    <div className="left">

                        <div className="stickey_postition">
                            {/* level row */}
                            <div className="level_row">
                                <div className="a">
                                    <span className={state.questionsList[state.selectedQuestion].level == "easy" ? "active" : ""}>Easy</span>
                                    <span className={state.questionsList[state.selectedQuestion].level == "medium" ? "active" : ""}>Medium</span>
                                    <span className={state.questionsList[state.selectedQuestion].level == "hard" ? "active" : ""}>Hard</span>
                                </div>
                                <div className="b">
                                    Time Left : 180 min
                                </div>
                            </div>
                            {/* level row end */}


                            {/* sub row for question type row */}
                            <div className="sub_row">
                                <div className="a">
                                    Question Type :
                                    {
                                        state.selectedSubQuestion.QuestionType == "0" ? " Single Correct Answer" :
                                            state.selectedSubQuestion.QuestionType == "1" ? " Multiple Correct Answer" : " Numeric Type Answer"}

                                </div>
                                <div className="b">
                                    <span>Marks for correct answer = <b className="text-success">+{state.selectedSubQuestion.Marks}</b> and </span>
                                    <span>Negative marks = <b className="text-danger">-{state.selectedSubQuestion.NegativeMarks}</b></span>
                                </div>
                            </div>
                            {/* sub row for question type row END*/}

                            {/* sub row for question type row */}
                            <div className="sub_row border">
                                <div className="a">
                                    Question No. {state.selectedQuestion + 1}
                                </div>
                                <div className="b">
                                    Subquestion Id. {state.selectedSubQuestion.id}
                                </div>
                            </div>
                            {/* sub row for question type row END*/}

                        </div>
                        {/* questionDetailBox Start */}
                        {/* for single answer */}
                        {
                            state.selectedSubQuestion.QuestionType == "0" ?
                                <div id="questionDetailBox">
                                    <div className="question">
                                        {state.selectedSubQuestion.Question}
                                    </div>

                                    <div className="options_div">
                                        <div className="option_box">
                                            {
                                                currentAnswer.CorrectAnswer == 0 ?
                                                    <div className="optionCircle a" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 0, }) }}><i class="fa-solid fa-check"></i></div> :
                                                    <div className="optionCircle" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 0, }) }}></div>
                                            }
                                            {/* <input type="radio" name="singleAnswer" id="op1_radio"
                                                onChange={() => {
                                                    SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 0, })
                                                }}
                                            /> */}
                                            <label htmlFor="op1_radio">{state.selectedSubQuestion.Option1}</label>
                                        </div>
                                        <div className="option_box">
                                            {
                                                currentAnswer.CorrectAnswer == 1 ?
                                                    <div className="optionCircle a" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 1, }) }}><i class="fa-solid fa-check"></i></div> :
                                                    <div className="optionCircle" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 1, }) }}></div>
                                            }
                                            {/* <input type="radio" name="singleAnswer" id="op2_radio"
                                                onChange={() => {
                                                    SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 1, })
                                                }}
                                            /> */}
                                            <label htmlFor="op2_radio">{state.selectedSubQuestion.Option2}</label>
                                        </div>
                                        <div className="option_box">
                                            {
                                                currentAnswer.CorrectAnswer == 2 ?
                                                    <div className="optionCircle a" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 2, }) }}><i class="fa-solid fa-check"></i></div> :
                                                    <div className="optionCircle" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 2, }) }}></div>
                                            }
                                            {/* <input type="radio" name="singleAnswer" id="op3_radio"
                                                onChange={() => {
                                                    SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 2, })
                                                }}
                                            /> */}
                                            <label htmlFor="op3_radio">{state.selectedSubQuestion.Option3}</label>
                                        </div>
                                        <div className="option_box">
                                            {
                                                currentAnswer.CorrectAnswer == 3 ?
                                                    <div className="optionCircle a" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 3, }) }}><i class="fa-solid fa-check"></i></div> :
                                                    <div className="optionCircle" onClick={() => { SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 3, }) }}></div>
                                            }
                                            {/* <input type="radio" name="singleAnswer" id="op4_radio"
                                                onChange={() => {
                                                    SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: 3, })
                                                }}
                                            /> */}
                                            <label htmlFor="op4_radio">{state.selectedSubQuestion.Option4}</label>
                                        </div>
                                    </div>
                                </div> : state.selectedSubQuestion.QuestionType == "1" ?
                                    //  for multiple answer 
                                    <div id="questionDetailBox">
                                        <div className="question">
                                            {state.selectedSubQuestion.Question}
                                        </div>

                                        <div className="options_div">
                                            <div className="option_box">
                                                {
                                                    currentAnswer.AnswerArr[0] == true ?
                                                        <div className="optionCircle a" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[0] = !oldAnswerArr[0]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                            <i class="fa-solid fa-check"></i>
                                                        </div>
                                                        // <input type="checkbox" name="multiSelectorCheckbox" id="op1_checkbox"
                                                        //     value={0}
                                                        //     onChange={() => {
                                                        //         // old array
                                                        //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                        //         oldAnswerArr[0] = !oldAnswerArr[0]
                                                        //         console.log(oldAnswerArr)
                                                        //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        //     }}
                                                        //     checked />
                                                        :
                                                        <div className="optionCircle" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[0] = !oldAnswerArr[0]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>

                                                        </div>
                                                    // <input type="checkbox" name="multiSelectorCheckbox" id="op1_checkbox"
                                                    //     value={0}
                                                    //     onChange={() => {
                                                    //         // old array
                                                    //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                    //         oldAnswerArr[0] = !oldAnswerArr[0]
                                                    //         console.log(oldAnswerArr)
                                                    //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                    //     }}
                                                    // />
                                                }
                                                <label htmlFor="op1_checkbox">{state.selectedSubQuestion.Option1}</label>
                                            </div>
                                            <div className="option_box">
                                                {
                                                    currentAnswer.AnswerArr[1] == true ?
                                                        <div className="optionCircle a" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[1] = !oldAnswerArr[1]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                            <i class="fa-solid fa-check"></i>
                                                        </div>
                                                        // <input type="checkbox" name="multiSelectorCheckbox" id="op2_checkbox"
                                                        //     value={1}
                                                        //     onChange={() => {
                                                        //         // old array
                                                        //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                        //         oldAnswerArr[1] = !oldAnswerArr[1]
                                                        //         console.log(oldAnswerArr)
                                                        //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        //     }}
                                                        //     checked
                                                        // /> 
                                                        :
                                                        <div className="optionCircle" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[1] = !oldAnswerArr[1]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                        </div>
                                                    // <input type="checkbox" name="multiSelectorCheckbox" id="op2_checkbox"
                                                    //     value={1}
                                                    //     onChange={() => {
                                                    //         // old array
                                                    //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                    //         oldAnswerArr[1] = !oldAnswerArr[1]
                                                    //         console.log(oldAnswerArr)
                                                    //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                    //     }}
                                                    // />
                                                }
                                                <label htmlFor="op2_checkbox">{state.selectedSubQuestion.Option2}</label>
                                            </div>
                                            <div className="option_box">
                                                {
                                                    currentAnswer.AnswerArr[2] == true ?
                                                        <div className="optionCircle a" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[2] = !oldAnswerArr[2]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                            <i class="fa-solid fa-check"></i>
                                                        </div>
                                                        // <input type="checkbox" name="multiSelectorCheckbox" id="op3_checkbox"
                                                        //         value={2}
                                                        //         onChange={() => {
                                                        //             // old array
                                                        //             let oldAnswerArr = currentAnswer.AnswerArr;
                                                        //             oldAnswerArr[2] = !oldAnswerArr[2]
                                                        //             SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        //         }}
                                                        //         checked
                                                        //     />
                                                        :
                                                        <div className="optionCircle" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[2] = !oldAnswerArr[2]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                        </div>

                                                    // <input type="checkbox" name="multiSelectorCheckbox" id="op3_checkbox"
                                                    //     value={2}
                                                    //     onChange={() => {
                                                    //         // old array
                                                    //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                    //         oldAnswerArr[2] = !oldAnswerArr[2]
                                                    //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                    //     }}
                                                    // />
                                                }
                                                <label htmlFor="op3_checkbox">{state.selectedSubQuestion.Option3}</label>
                                            </div>
                                            <div className="option_box">
                                                {
                                                    currentAnswer.AnswerArr[3] == true ?
                                                        <div className="optionCircle a" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[3] = !oldAnswerArr[3]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                            <i class="fa-solid fa-check"></i>
                                                        </div>

                                                        // <input type="checkbox" name="multiSelectorCheckbox" id="op4_checkbox"
                                                        //     value={3}
                                                        //     onChange={() => {
                                                        //         // old array
                                                        //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                        //         oldAnswerArr[3] = !oldAnswerArr[3]
                                                        //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        //     }}
                                                        //     checked
                                                        // /> 
                                                        :
                                                        <div className="optionCircle" onClick={() => {
                                                            // old array
                                                            let oldAnswerArr = currentAnswer.AnswerArr;
                                                            oldAnswerArr[3] = !oldAnswerArr[3]
                                                            console.log(oldAnswerArr)
                                                            SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                        }}>
                                                        </div>

                                                    // <input type="checkbox" name="multiSelectorCheckbox" id="op4_checkbox"
                                                    //     value={3}
                                                    //     onChange={() => {
                                                    //         // old array
                                                    //         let oldAnswerArr = currentAnswer.AnswerArr;
                                                    //         oldAnswerArr[3] = !oldAnswerArr[3]
                                                    //         SetCurrentAnswer({ ...currentAnswer, AnswerArr: oldAnswerArr })
                                                    //     }}
                                                    // />
                                                }
                                                <label htmlFor="op4_checkbox">{state.selectedSubQuestion.Option4}</label>
                                            </div>
                                        </div>
                                    </div> :
                                    // for numeric answer 
                                    <div id="questionDetailBox">
                                        <div className="question">
                                            {state.selectedSubQuestion.Question}
                                        </div>

                                        <div className="options_div col-4">
                                            <input type="text" onChange={(e) => {
                                                SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: e.target.value })
                                            }} />
                                        </div>
                                    </div>
                            //  questionDetailBox END 
                        }


                        {/* sub row for save and next row */}
                        <div className="sub_row bottom_save_and_next" onClick={() => {
                            document.getElementsByClassName("bottom_save_and_next")[0].classList.toggle("active")
                        }}>
                            <div className="a">
                                <button className="btn" onClick={markForReviewAndNext}>
                                    Mark for review & next
                                </button>
                                <button className="btn" onClick={clearResponse}>
                                    Clear Response
                                </button>
                            </div>
                            <div className="b">
                                <button className="btn btn-primary" onClick={NextQuestion}>
                                    save and next
                                </button>
                            </div>
                        </div>
                        {/* sub row for save and next  row END*/}


                    </div>
                    {/* open all questions */}
                    <div className="floatingBtn" onClick={() => {
                        document.getElementById("allQUestionListIDDtl").classList.toggle("active")
                    }}>
                        <i class="fa-solid fa-list"></i>
                    </div>
                    <div className="right" id="allQUestionListIDDtl">

                        <div className="notations">
                            <span>
                                <div className="notationDiv">
                                    <img src={require("./n1.png")} alt="" />
                                    <p>1</p>
                                </div>
                                <span>Answered</span>
                            </span>
                            <span>
                                <div className="notationDiv">
                                    <img src={require("./n2.png")} alt="" />
                                    <p>2</p>
                                </div>
                                <span>Not Answered</span>
                            </span>
                            <span>
                                <div className="notationDiv">
                                    <img src={require("./n3.png")} alt="" />
                                    <p>3</p>
                                </div>
                                <span>Not Visited</span>
                            </span>
                            <span>
                                <div className="notationDiv">
                                    <img src={require("./n4.png")} alt="" />
                                    <p>4</p>
                                </div>
                                <span>Marked For Review</span>
                            </span>
                            <span>
                                <div className="notationDiv">
                                    <img src={require("./n5.png")} alt="" />
                                    <p>5</p>
                                </div>
                                <span>Answered & Marked for Review(will be considered for evaluation)</span>
                            </span>
                        </div>

                        <div className="heading_question">
                            Choose a Question
                        </div>

                        <div className="questionNumberArr notations">
                            {
                                state.questionAssigned.map((question, index) => {
                                    let myQuestionResults = state.questionAssigned[index];
                                    if (myQuestionResults.questionType == "0") {
                                        // visited
                                        if (myQuestionResults.submittedStatus == 2) {
                                            // inside mark review
                                            // with answer
                                            if (myQuestionResults.submittedAnswerForSingle == null) {
                                                // not answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n4.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n5.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                            // not answer
                                        }
                                        // not review

                                        if (myQuestionResults.submittedStatus == 1) {
                                            if (myQuestionResults.submittedAnswerForSingle == null) {
                                                // not answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n2.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n1.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                        }

                                        if (myQuestionResults.submittedStatus == 0) {
                                            return <div className="notationDiv">
                                                <img src={require("./n3.png")} alt="" />
                                                <p>{index + 1}</p>
                                            </div>
                                        }
                                    }
                                    if (myQuestionResults.questionType == "1") {

                                        // visited
                                        if (myQuestionResults.submittedStatus == 2) {
                                            // inside mark review
                                            // with answer
                                            if (myQuestionResults.submittedAnswerForMulti == null) {
                                                // not answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n4.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n5.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                            // not answer
                                        }
                                        // not review

                                        if (myQuestionResults.submittedStatus == 1) {
                                            if (myQuestionResults.submittedAnswerForMulti == null) {
                                                // not answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n2.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv">
                                                    <img src={require("./n1.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                        }

                                        if (myQuestionResults.submittedStatus == 0) {
                                            return <div className="notationDiv">
                                                <img src={require("./n3.png")} alt="" />
                                                <p>{index + 1}</p>
                                            </div>
                                        }

                                    }
                                })
                            }
                        </div>

                        <div className="submitBtn am">
                            <button className="btn btn-primary" onClick={fullResult}>Submit</button>
                        </div>
                    </div>
                </div>


            </div>
        </div >
    );
}


export default Questions;
