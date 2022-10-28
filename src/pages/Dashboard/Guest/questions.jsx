import React, { forwardRef, useEffect, useState } from "react";
import { useStyles } from "../../../utils/useStyles";
import axios from "axios";
import MaterialTable from "material-table";
import { NumericKeyboard } from 'react-numeric-keyboard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { ReactCalculator } from "simple-react-calculator";
import swal from 'sweetalert';

// katex
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setSuccessMsg, setTopics } from "../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";
import { Link } from "react-router-dom";


function QuestionsGuest() {
    const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
    const { admin } = useSelector((state) => state.auth);
    const { guestTopic } = useSelector((state) => state.main)
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { topicId } = useParams()
    const [isWait, setWait] = useState(true)
    const [timingData, setTimingData] = useState({
        minutes: 0,
        seconds: 0,
    })
    const [timeDue, setTimeDue] = useState(false)
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


    useEffect(() => {
        const handleTabClose = event => {
            event.preventDefault();

            console.log('beforeunload event triggered');

            return (event.returnValue = 'Are you sure you want to exit?');
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    useEffect(() => {
        if (isWait) return;
        const interval = setInterval(() => {
            if (timingData.seconds == 0) {
                if (timingData.minutes == 0) {
                    fullResult()
                    clearInterval(interval);
                    return;
                } else {
                    setTimingData({
                        minutes: timingData.minutes - 1,
                        seconds: 60
                    })
                }
            } else {
                setTimingData({
                    ...timingData,
                    seconds: timingData.seconds - 1
                })
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isWait, timingData, timeDue])

    useEffect(() => {
        console.log("guest topic data")
        console.log(guestTopic)
        if(!guestTopic.timing){
            history.push("/guest/topics")
        }
        // get questionsList
        axios.get(`${process.env.REACT_APP_API_URI}guest/guestquestions/?topic=${topicId}`).then(response => {
            const questiondata = response.data;
            // remove empty questions 
            const result = questiondata.filter((question) => question.subquestion.length > 0)
            setTimingData({
                minutes: guestTopic.timing,
                seconds: 0,
            })
            assignQuestions(result, questiondata)
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

    const onChangeKeypad = ({ value, name }) => {
        console.log([value, name])
        if (currentAnswer.CorrectAnswer == null) {
            currentAnswer.CorrectAnswer = "";
        }
        if (name == "Backspace") {
            SetCurrentAnswer({
                ...currentAnswer,
                CorrectAnswer: currentAnswer.CorrectAnswer.slice(0, -1)
            })
            return;
        }
        SetCurrentAnswer({
            ...currentAnswer,
            CorrectAnswer: currentAnswer.CorrectAnswer + name
        })
    };
    const unMarkForReviewAndNext = () => {
        let oldQuestionResult = state.questionAssigned;
        oldQuestionResult[state.selectedQuestion].submittedStatus = 1
        setState({
            ...state,
            questionAssigned: oldQuestionResult
        })
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
            return;
        }

        let mainQuestionData = state.questionAssigned[state.selectedQuestion + 1].mainQuestionData
        let subQuestionData = state.questionAssigned[state.selectedQuestion + 1].subQuestionData
        oldQuestionResult[state.selectedQuestion + 1].submittedStatus = 1


        // set answers
        let oldCurrentAnswer = currentAnswer
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "0") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForSingle
        }
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "1") {
            if (oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForMulti == null) {
                oldCurrentAnswer.AnswerArr = [false, false, false, false]
            } else {
                oldCurrentAnswer.AnswerArr = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForMulti
            }
        }
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "2") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForNumeric
        }

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion + 1,
            selectedQuestionData: mainQuestionData,
            selectedSubQuestion: subQuestionData,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer(oldCurrentAnswer)
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

    const SaveData = () => {
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


        if (state.questionAssigned.length == state.selectedQuestion + 1) {
            setState({
                ...state,
                questionAssigned: oldQuestionResult
            })
            return;
        }

        let mainQuestionData = state.questionAssigned[state.selectedQuestion + 1].mainQuestionData
        let subQuestionData = state.questionAssigned[state.selectedQuestion + 1].subQuestionData
        oldQuestionResult[state.selectedQuestion + 1].submittedStatus = 1

        // set answers
        let oldCurrentAnswer = currentAnswer
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "0") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForSingle
        }
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "1") {
            if (oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForMulti == null) {
                oldCurrentAnswer.AnswerArr = [false, false, false, false]
            } else {
                oldCurrentAnswer.AnswerArr = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForMulti
            }
        }
        if (oldQuestionResult[state.selectedQuestion + 1].questionType == "2") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[state.selectedQuestion + 1].submittedAnswerForNumeric
        }

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion + 1,
            selectedQuestionData: mainQuestionData,
            selectedSubQuestion: subQuestionData,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer(oldCurrentAnswer)

    }

    const NextQuestion = () => { }

    const SelectQuestion = (QuestionIndex) => {
        let oldQuestionResult = state.questionAssigned;
        let mainQuestionData = state.questionAssigned[QuestionIndex].mainQuestionData
        let subQuestionData = state.questionAssigned[QuestionIndex].subQuestionData
        if (oldQuestionResult[QuestionIndex].submittedStatus == 0) {
            oldQuestionResult[QuestionIndex].submittedStatus = 1
        }

        let oldCurrentAnswer = currentAnswer
        if (oldQuestionResult[QuestionIndex].questionType == "0") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[QuestionIndex].submittedAnswerForSingle
        }
        if (oldQuestionResult[QuestionIndex].questionType == "1") {
            if (oldQuestionResult[QuestionIndex].submittedAnswerForMulti == null) {
                oldCurrentAnswer.AnswerArr = [false, false, false, false]
            } else {
                oldCurrentAnswer.AnswerArr = oldQuestionResult[QuestionIndex].submittedAnswerForMulti
            }
        }
        if (oldQuestionResult[QuestionIndex].questionType == "2") {
            oldCurrentAnswer.CorrectAnswer = oldQuestionResult[QuestionIndex].submittedAnswerForNumeric
        }
        setState({
            ...state,
            selectedQuestion: QuestionIndex,
            selectedQuestionData: mainQuestionData,
            selectedSubQuestion: subQuestionData,
            questionAssigned: oldQuestionResult
        })

        SetCurrentAnswer(oldCurrentAnswer)
    }

    const fullResult = () => {
        console.log("Results : ")
        console.log(state.questionAssigned)
        var totalMarks = 0;
        var achieveMarks = 0;
        var singleQuestinResultList = []
        state.questionAssigned.map((singleQuestion, index) => {
            let questionType = singleQuestion.questionType;

            if (questionType == "0") {
                totalMarks += singleQuestion.subQuestionData.Marks

                if (singleQuestion.submittedAnswerForSingle != null) {

                    let answerArr = singleQuestion.subQuestionData.Answer.split(",")
                    if (answerArr[singleQuestion.submittedAnswerForSingle] == 'true') {
                        console.log("Right Answer")
                        achieveMarks += singleQuestion.subQuestionData.Marks
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": singleQuestion.subQuestionData.Marks
                        })
                    } else {
                        achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
                        console.log("Wrong Answer")
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": -singleQuestion.subQuestionData.NegativeMarks
                        })
                    }

                } else {
                    singleQuestinResultList.push({
                        "mainQuestion": singleQuestion.mainQuestionData.id,
                        "subQuestion": singleQuestion.subQuestionData.id,
                        "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
                        "submittedStatus": singleQuestion.submittedStatus,
                        "marks": 0
                    })
                }
            }

            if (questionType == "1") {
                totalMarks += singleQuestion.subQuestionData.Marks
                let answerArr = singleQuestion.subQuestionData.Answer.split(",")
                let submittedAnswerArr = singleQuestion.submittedAnswerForMulti
                if (submittedAnswerArr != null) {
                    let answerStatus = false;
                    if (submittedAnswerArr[0].toString() == answerArr[0]) {
                        if (submittedAnswerArr[1].toString() == answerArr[1]) {
                            if (submittedAnswerArr[2].toString() == answerArr[2]) {
                                if (submittedAnswerArr[3].toString() == answerArr[3]) {
                                    answerStatus = true;
                                }
                            }
                        }
                    }

                    if (answerStatus == true) {
                        achieveMarks += singleQuestion.subQuestionData.Marks
                        console.log("multi true")
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti.toString(),
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": singleQuestion.subQuestionData.Marks
                        })
                    } else {
                        achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
                        console.log("multi false")
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti.toString(),
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": -singleQuestion.subQuestionData.NegativeMarks
                        })
                    }
                } else {
                    singleQuestinResultList.push({
                        "mainQuestion": singleQuestion.mainQuestionData.id,
                        "subQuestion": singleQuestion.subQuestionData.id,
                        "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti,
                        "submittedStatus": singleQuestion.submittedStatus,
                        "marks": 0
                    })
                }

            }

            if (questionType == "2") {
                totalMarks += singleQuestion.subQuestionData.Marks
                if (singleQuestion.submittedAnswerForNumeric != null) {
                    let correctAnswer = parseFloat(singleQuestion.subQuestionData.CorrectAnswer)
                    let Rangemax = parseFloat(singleQuestion.subQuestionData.Rangemax)
                    let Rangemin = parseFloat(singleQuestion.subQuestionData.Rangemin)
                    let submittedAnswer = parseFloat(singleQuestion.submittedAnswerForNumeric)
                    let answerStatus = false;
                    if (correctAnswer == submittedAnswer) {
                        if (correctAnswer <= Rangemax && correctAnswer >= Rangemin) {
                            answerStatus = true;
                        }
                    }

                    if (answerStatus == true) {
                        achieveMarks += singleQuestion.subQuestionData.Marks
                        console.log("multi true")
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": singleQuestion.subQuestionData.Marks
                        })
                    } else {
                        achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
                        console.log("multi false")
                        singleQuestinResultList.push({
                            "mainQuestion": singleQuestion.mainQuestionData.id,
                            "subQuestion": singleQuestion.subQuestionData.id,
                            "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
                            "submittedStatus": singleQuestion.submittedStatus,
                            "marks": -singleQuestion.subQuestionData.NegativeMarks
                        })
                    }
                } else {
                    singleQuestinResultList.push({
                        "mainQuestion": singleQuestion.mainQuestionData.id,
                        "subQuestion": singleQuestion.subQuestionData.id,
                        "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
                        "submittedStatus": singleQuestion.submittedStatus,
                        "marks": 0
                    })
                }

            }

            if (state.questionAssigned.length == index + 1) {
                console.log("totalMarks")
                console.log("achieveMarks")
                console.log(totalMarks)
                console.log(achieveMarks)

                const finalResultData = {
                    "Topic": state.topicDetail.id,
                    "totalMarks": totalMarks,
                    "resultMarks": achieveMarks,
                    "totalTime": state.topicDetail.timing,
                    "usedTime": state.topicDetail.timing - timingData.minutes,
                    "examQuestions": singleQuestinResultList
                }

                console.log("finalResultData")
                console.log(finalResultData)
                swal(`Marks : ${achieveMarks}/${totalMarks}`, "Test Submit Successfully", "success");
            }
        })
    }

    if (isWait) {
        return <div className="spinner"></div>
    }

    return (
        <div className={classes.root}>
            <div id="calculator">
                <ReactCalculator />
            </div>
            <div id="QuestionsPageId">

                <nav className="QuestionsPageNav d-flex justify-content-between">
                    <span>
                        <span onClick={() => {
                            if (window.confirm("Are you sure to exit ?")) {
                                history.push("/student/")
                            }
                        }}>
                            <img src={"/assets/images/logo.png"} alt="" height={"60px"} />
                            <h6>CelatomUniverse</h6>
                        </span>
                        <i class="fa-solid fa-bars" onClick={() => {
                            document.getElementById("topicDtlId").classList.toggle("activeMobile")
                        }}></i>
                    </span>
                    <Link onClick={() => {
                        if (window.confirm("Are you sure to exit ?")) {
                            history.push("/student/")
                        }
                    }}>
                        <div className="homeBtnQuetion text-white">Home</div>
                    </Link>
                </nav>

                {/* topic details */}
                <div className="topicDtl" id="topicDtlId">
                    <div className="left">
                        Topic - {state.topicDetail.Topicname}
                    </div>
                    <div className="right">
                        {
                            state.topicDetail.calculatorStatus ?
                                <span onClick={() => {
                                    document.getElementById("calculator").classList.toggle("active")
                                }}>
                                    <img src={require("./calculator.png")} alt="" />
                                    <span>Calculator</span>
                                </span> : <></>
                        }
                        <span data-toggle="modal" data-target="#exampleModalLong2">
                            <img src={require("./questionPaper.png")} alt="" />
                            <span>Question Paper</span>
                        </span>
                        <span data-toggle="modal" data-target="#exampleModalLong">
                            <img src={require("./viewInstructions.png")} alt="" />
                            <span>View Instructions</span>
                        </span>
                    </div>
                </div>
                {/* end topic details */}

                {/* Instruction model */}
                <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">Instructions</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body instructionsModel">
                                <img src={require("./instructions.png")} alt="" />
                                <img src={require("./instructions2.png")} alt="" />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Instruction model End */}

                {/* Question paper model */}
                <div class="modal fade" id="exampleModalLong2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLong2Title" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLong2Title">Question Paper</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body instructionsModel">
                                {
                                    isWait ? <>Loading...</> :
                                        state.questionAssigned.map((singleQuestion, index) => {
                                            return <div className="singleQuestionPaperDetail">
                                                {
                                                    singleQuestion.subQuestionData.QuestionType == "0" ?
                                                        <>
                                                            <div className="text-primary d-flex justify-content-between">
                                                                <span>Single Answer Type</span>
                                                                <span>
                                                                    <span className="text-success mx-2">+{singleQuestion.subQuestionData.Marks}</span>
                                                                    <span className="text-danger">-{singleQuestion.subQuestionData.NegativeMarks}</span>
                                                                </span>
                                                            </div>
                                                            <div>{`Q${index + 1})`} {singleQuestion.subQuestionData.Question}</div>

                                                            <h6 className="mt-2">Options : </h6>
                                                            {
                                                                singleQuestion.subQuestionData.Option1 != "" ?
                                                                    <div>{`A) ${singleQuestion.subQuestionData.Option1}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestionData.Option2 != "" ?
                                                                    <div>{`B) ${singleQuestion.subQuestionData.Option2}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestionData.Option3 != "" ?
                                                                    <div>{`C) ${singleQuestion.subQuestionData.Option3}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestionData.Option4 != "" ?
                                                                    <div>{`D) ${singleQuestion.subQuestionData.Option4}`}</div> : <></>
                                                            }
                                                        </> :
                                                        singleQuestion.subQuestionData.QuestionType == "1" ?
                                                            <>
                                                                <div className="text-primary d-flex justify-content-between">
                                                                    <span>Multiple Answer Type</span>
                                                                    <span>
                                                                        <span className="text-success mx-2">+{singleQuestion.subQuestionData.Marks}</span>
                                                                        <span className="text-danger">-{singleQuestion.subQuestionData.NegativeMarks}</span>
                                                                    </span>
                                                                </div>
                                                                <div>{`Q${index + 1})`} {singleQuestion.subQuestionData.Question}</div>

                                                                <h6 className="mt-2">Options : </h6>
                                                                {
                                                                    singleQuestion.subQuestionData.Option1 != "" ?
                                                                        <div>{`A) ${singleQuestion.subQuestionData.Option1}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestionData.Option2 != "" ?
                                                                        <div>{`B) ${singleQuestion.subQuestionData.Option2}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestionData.Option3 != "" ?
                                                                        <div>{`C) ${singleQuestion.subQuestionData.Option3}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestionData.Option4 != "" ?
                                                                        <div>{`D) ${singleQuestion.subQuestionData.Option4}`}</div> : <></>
                                                                }
                                                            </> :
                                                            singleQuestion.subQuestionData.QuestionType == "2" ?
                                                                <>
                                                                    <div className="text-primary d-flex justify-content-between">
                                                                        <span>Numeric Type Answer</span>
                                                                        <span>
                                                                            <span className="text-success mx-2">+{singleQuestion.subQuestionData.Marks}</span>
                                                                            <span className="text-danger">-{singleQuestion.subQuestionData.NegativeMarks}</span>
                                                                        </span>
                                                                    </div>
                                                                    <div>{`Q${index + 1})`} {singleQuestion.subQuestionData.Question}</div>
                                                                </> : <></>

                                                }
                                            </div>
                                        })
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question paper model End */}

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
                                    <div className="text-secondary">Time Left :</div> &nbsp; <div className="text-primary mt-1">{timingData.minutes}:{timingData.seconds < 10 ? "0" + timingData.seconds : timingData.seconds}</div>
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
                                {/* <div className="b">
                                    Subquestion Id. {state.selectedSubQuestion.id}
                                </div> */}
                            </div>
                            {/* sub row for question type row END*/}

                        </div>
                        {/* questionDetailBox Start */}
                        {/* for single answer */}
                        {
                            state.selectedSubQuestion.QuestionType == "0" ?
                                <div id="questionDetailBox">
                                    <div className="question">
                                        {state.selectedSubQuestion.Question.split("$k$").map((data, index) => {
                                            if (index % 2 == 1) {
                                                return <InlineMath math={data} />
                                            } else {
                                                return data
                                            }
                                        })}
                                    </div>

                                    <div className="options_div">

                                        {
                                            state.selectedSubQuestion.Option1 != "" ?
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
                                                    <label htmlFor="op1_radio">{state.selectedSubQuestion.Option1.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>
                                        }

                                        {
                                            state.selectedSubQuestion.Option2 != "" ?

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
                                                    <label htmlFor="op2_radio">{state.selectedSubQuestion.Option2.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>
                                        }
                                        {
                                            state.selectedSubQuestion.Option3 != "" ?
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
                                                    <label htmlFor="op3_radio">{state.selectedSubQuestion.Option3.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                        {
                                            state.selectedSubQuestion.Option4 != "" ?
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
                                                    <label htmlFor="op4_radio">{state.selectedSubQuestion.Option4.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                    </div>
                                </div> : state.selectedSubQuestion.QuestionType == "1" ?
                                    //  for multiple answer 
                                    <div id="questionDetailBox">
                                        <div className="question">
                                            {state.selectedSubQuestion.Question.split("$k$").map((data, index) => {
                                                if (index % 2 == 1) {
                                                    return <InlineMath math={data} />
                                                } else {
                                                    return data
                                                }
                                            })}
                                        </div>

                                        <div className="options_div">
                                            {state.selectedSubQuestion.Option1 != "" ?
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
                                                    <label htmlFor="op1_checkbox">{state.selectedSubQuestion.Option1.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                            {state.selectedSubQuestion.Option2 != "" ?
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
                                                    <label htmlFor="op2_checkbox">{state.selectedSubQuestion.Option2.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                            {state.selectedSubQuestion.Option2 != "" ?
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
                                                    <label htmlFor="op3_checkbox">{state.selectedSubQuestion.Option3.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                            {state.selectedSubQuestion.Option4 != "" ?
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
                                                    <label htmlFor="op4_checkbox">{state.selectedSubQuestion.Option4.split("$k$").map((data, index) => {
                                                        if (index % 2 == 1) {
                                                            return <InlineMath math={data} />
                                                        } else {
                                                            return data
                                                        }
                                                    })}</label>
                                                </div> : <></>}
                                        </div>
                                    </div> :
                                    // for numeric answer 
                                    <div id="questionDetailBox">
                                        <div className="question">
                                            {state.selectedSubQuestion.Question.split("$k$").map((data, index) => {
                                                if (index % 2 == 1) {
                                                    return <InlineMath math={data} />
                                                } else {
                                                    return data
                                                }
                                            })}
                                        </div>

                                        <div className="options_div col-4">
                                            <input type="text" onChange={
                                                (e) => {
                                                    return;
                                                    SetCurrentAnswer({ ...currentAnswer, CorrectAnswer: e.target.value })
                                                }
                                            } readOnly value={currentAnswer.CorrectAnswer} />
                                            <button className="btn btn-success m-2" onClick={() => {
                                                setIsOpenKeyboard(!isOpenKeyboard)
                                            }}>Keypad</button>
                                        </div>

                                        <div id="studentKeyboard1">
                                            <NumericKeyboard isOpen={isOpenKeyboard} onChange={onChangeKeypad} leftIcon={<div className='dotStyle' onClick={() => {
                                                SetCurrentAnswer({
                                                    ...currentAnswer,
                                                    CorrectAnswer: currentAnswer.CorrectAnswer + "."
                                                })
                                            }}>.</div>} />
                                        </div>
                                    </div>
                            //  questionDetailBox END 
                        }


                        {/* sub row for save and next row */}
                        <div className="sub_row bottom_save_and_next" onClick={() => {
                            document.getElementsByClassName("bottom_save_and_next")[0].classList.toggle("active")
                        }}>
                            <div className="a">
                                {
                                    state.questionAssigned[state.selectedQuestion].submittedStatus == 2 ?
                                        <button className="btn btn-danger" onClick={unMarkForReviewAndNext}>
                                            Unmark for review
                                        </button> :
                                        <button className="btn" onClick={markForReviewAndNext}>
                                            {
                                                state.questionAssigned.length != state.selectedQuestion + 1 ?
                                                    "Mark for review & next" : "Mark for review"
                                            }
                                        </button>
                                }
                                <button className="btn" onClick={clearResponse}>
                                    Clear Response
                                </button>
                            </div>
                            <div className="b">
                                <button className="btn btn-primary" onClick={SaveData}>
                                    {
                                        state.questionAssigned.length != state.selectedQuestion + 1 ?
                                            "SAVE AND NEXT " : "SAVE"
                                    }
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
                            <span className="col-12 notmaxwidth">
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
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n4.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
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
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n2.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n1.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                        }

                                        if (myQuestionResults.submittedStatus == 0) {
                                            return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
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
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n4.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
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
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n2.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n1.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                        }

                                        if (myQuestionResults.submittedStatus == 0) {
                                            return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                <img src={require("./n3.png")} alt="" />
                                                <p>{index + 1}</p>
                                            </div>
                                        }

                                    }

                                    //  for numeric
                                    if (myQuestionResults.questionType == "2") {

                                        // visited
                                        if (myQuestionResults.submittedStatus == 2) {
                                            // inside mark review
                                            // with answer
                                            if (myQuestionResults.submittedAnswerForNumeric == null) {
                                                // not answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n4.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n5.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                            // not answer
                                        }
                                        // not review

                                        if (myQuestionResults.submittedStatus == 1) {
                                            if (myQuestionResults.submittedAnswerForNumeric == null) {
                                                // not answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n2.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            } else {
                                                // yes answer
                                                return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
                                                    <img src={require("./n1.png")} alt="" />
                                                    <p>{index + 1}</p>
                                                </div>
                                            }
                                        }

                                        if (myQuestionResults.submittedStatus == 0) {
                                            return <div className="notationDiv" onClick={() => SelectQuestion(index)}>
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


export default QuestionsGuest;
