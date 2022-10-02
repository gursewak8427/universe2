import React, { forwardRef, useEffect, useState } from "react";
import Heading from "../../components/Heading/Heading";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import { useStyles } from "../../../../../utils/useStyles";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import MaterialTable from "material-table";
import { NumericKeyboard } from 'react-numeric-keyboard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { ReactCalculator } from "simple-react-calculator";
import swal from 'sweetalert';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setSuccessMsg, setTopics } from "../../../../../services/actions/mainAction";
import { useSelect } from "@mui/base";
import { Switch } from "@mui/material";
import { Link } from "react-router-dom";


function OldQuestions() {
    const [isOpenKeyboard, setIsOpenKeyboard] = useState(false);
    const { admin } = useSelector((state) => state.auth);
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { topicId, examId } = useParams()
    const [isWait, setWait] = useState(true)
    const [timingData, setTimingData] = useState({
        minutes: 0,
        seconds: 0,
    })
    const [timeDue, setTimeDue] = useState(false)
    const [state, setState] = useState({
        testDetail: {},
        questionsList: [],
        selectedQuestion: 0,
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
        // get questionsList
        axios.get(`${process.env.REACT_APP_API_URI}students/examsubmit/`, config).then(response => {
            var examdata = response.data;
            // get target exam 
            const result = examdata.filter((exam) => exam.id == examId)
            console.log("examdata");
            console.log(result);

            setState({
                ...state,
                testDetail: result[0],
                questionsList: result[0].examQuestion,
                selectedQuestion: 0,
            })

            setWait(false)

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
                    testDetail: topicData[0],
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

    const SaveData = () => {
        if (state.questionsList.length == state.selectedQuestion + 1) {
            return;
        }

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion + 1,
        })
    }
    const SaveData2 = () => {
        if (state.selectedQuestion == 0) {
            return;
        }

        setState({
            ...state,
            selectedQuestion: state.selectedQuestion - 1,
        })
    }

    const NextQuestion = () => {

    }

    const SelectQuestion = (QuestionIndex) => {
        setState({
            ...state,
            selectedQuestion: QuestionIndex,
        })
    }

    const fullResult = () => {
        // console.log("Results : ")
        // console.log(state.questionAssigned)
        // var totalMarks = 0;
        // var achieveMarks = 0;
        // var singleQuestinResultList = []
        // state.questionAssigned.map((singleQuestion, index) => {
        //     let questionType = singleQuestion.questionType;



        //     if (questionType == "0") {
        //         totalMarks += singleQuestion.subQuestionData.Marks

        //         if (singleQuestion.submittedAnswerForSingle != null) {

        //             let answerArr = singleQuestion.subQuestionData.Answer.split(",")
        //             if (answerArr[singleQuestion.submittedAnswerForSingle] == 'true') {
        //                 console.log("Right Answer")
        //                 achieveMarks += singleQuestion.subQuestionData.Marks
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.Marks
        //                 })
        //             } else {
        //                 achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
        //                 console.log("Wrong Answer")
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.NegativeMarks
        //                 })
        //             }

        //         } else {
        //             singleQuestinResultList.push({
        //                 "mainQuestion": singleQuestion.mainQuestionData.id,
        //                 "subQuestion": singleQuestion.subQuestionData.id,
        //                 "submittedAnswerForSingle": singleQuestion.submittedAnswerForSingle,
        //                 "submittedStatus": singleQuestion.submittedStatus,
        //                 "marks": 0
        //             })
        //         }
        //     }

        //     if (questionType == "1") {
        //         totalMarks += singleQuestion.subQuestionData.Marks
        //         let answerArr = singleQuestion.subQuestionData.Answer.split(",")
        //         let submittedAnswerArr = singleQuestion.submittedAnswerForMulti
        //         if (submittedAnswerArr != null) {
        //             let answerStatus = false;
        //             if (submittedAnswerArr[0].toString() == answerArr[0]) {
        //                 if (submittedAnswerArr[1].toString() == answerArr[1]) {
        //                     if (submittedAnswerArr[2].toString() == answerArr[2]) {
        //                         if (submittedAnswerArr[3].toString() == answerArr[3]) {
        //                             answerStatus = true;
        //                         }
        //                     }
        //                 }
        //             }

        //             if (answerStatus == true) {
        //                 achieveMarks += singleQuestion.subQuestionData.Marks
        //                 console.log("multi true")
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.Marks
        //                 })
        //             } else {
        //                 achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
        //                 console.log("multi false")
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.NegativeMarks
        //                 })
        //             }
        //         } else {
        //             singleQuestinResultList.push({
        //                 "mainQuestion": singleQuestion.mainQuestionData.id,
        //                 "subQuestion": singleQuestion.subQuestionData.id,
        //                 "submittedAnswerForMulti": singleQuestion.submittedAnswerForMulti,
        //                 "submittedStatus": singleQuestion.submittedStatus,
        //                 "marks": 0
        //             })
        //         }

        //     }

        //     if (questionType == "2") {
        //         totalMarks += singleQuestion.subQuestionData.Marks
        //         if (singleQuestion.submittedAnswerForNumeric != null) {
        //             let correctAnswer = parseFloat(singleQuestion.subQuestionData.CorrectAnswer)
        //             let Rangemax = parseFloat(singleQuestion.subQuestionData.Rangemax)
        //             let Rangemin = parseFloat(singleQuestion.subQuestionData.Rangemin)
        //             let submittedAnswer = parseFloat(singleQuestion.submittedAnswerForNumeric)
        //             let answerStatus = false;
        //             if (correctAnswer == submittedAnswer) {
        //                 if (correctAnswer <= Rangemax && correctAnswer >= Rangemin) {
        //                     answerStatus = true;
        //                 }
        //             }

        //             if (answerStatus == true) {
        //                 achieveMarks += singleQuestion.subQuestionData.Marks
        //                 console.log("multi true")
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.Marks
        //                 })
        //             } else {
        //                 achieveMarks -= singleQuestion.subQuestionData.NegativeMarks
        //                 console.log("multi false")
        //                 singleQuestinResultList.push({
        //                     "mainQuestion": singleQuestion.mainQuestionData.id,
        //                     "subQuestion": singleQuestion.subQuestionData.id,
        //                     "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
        //                     "submittedStatus": singleQuestion.submittedStatus,
        //                     "marks": singleQuestion.subQuestionData.NegativeMarks
        //                 })
        //             }
        //         } else {
        //             singleQuestinResultList.push({
        //                 "mainQuestion": singleQuestion.mainQuestionData.id,
        //                 "subQuestion": singleQuestion.subQuestionData.id,
        //                 "submittedAnswerForNumeric": singleQuestion.submittedAnswerForNumeric,
        //                 "submittedStatus": singleQuestion.submittedStatus,
        //                 "marks": 0
        //             })
        //         }

        //     }

        //     if (state.questionAssigned.length == index + 1) {
        //         console.log("totalMarks")
        //         console.log("achieveMarks")
        //         console.log(totalMarks)
        //         console.log(achieveMarks)

        //         const finalResultData = {
        //             "Topic": state.testDetail.Topic.id,
        //             "totalMarks": totalMarks,
        //             "resultMarks": achieveMarks,
        //             "totalTime": state.testDetail.Topic.timing,
        //             "usedTime": state.testDetail.Topic.timing - timingData.minutes,
        //             "examQuestions": singleQuestinResultList
        //         }

        //         console.log("finalResultData")
        //         console.log(finalResultData)

        //         const config = {
        //             headers: {
        //                 'Authorization': `Bearer ${admin.token}`
        //             }
        //         }

        //         axios.post(`${process.env.REACT_APP_API_URI}students/examsubmit/`, finalResultData, config).then(response => {
        //             const responseData = response.data;
        //             console.log("Final Result Response")
        //             console.log(responseData)
        //             swal(`Marks : ${achieveMarks}/${totalMarks}`, "You successfully saved the result!", "success");
        //             history.push("/student/old_test_results/")
        //         }).catch(err => {
        //             console.log(err)
        //             swal("Sorry!", "You already attempt the exam!", "error");
        //             // alert(err.response.data.message)
        //         })
        //     }
        // })
    }

    if (isWait) {
        return <div className="spinner"></div>
    }


    const getNumericResult = () => {
        if (state.questionsList[state.selectedQuestion].submittedAnswerForNumeric)
            if (parseFloat(state.questionsList[state.selectedQuestion].submittedAnswerForNumeric) == parseFloat(state.questionsList[state.selectedQuestion].subQuestion.CorrectAnswer)) return true;

        return false
    }

    const getRightOrWrong = (optionNumber) => {
        var AnswerArr = state.questionsList[state.selectedQuestion].subQuestion.Answer.split(",")

        if (state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "0") {

            if (AnswerArr[optionNumber] == "true") {
                return <span className='m-2 text-success'>Right</span>
            } else {
                if (state.questionsList[state.selectedQuestion].submittedAnswerForSingle == optionNumber) {
                    return <span className='m-2 text-danger'>Wrong</span>
                } else {
                    return ""
                }
            }
        }

        if (state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "1") {
            if (state.questionsList[state.selectedQuestion].submittedAnswerForMulti) {
                var AnswerArr2 = state.questionsList[state.selectedQuestion].submittedAnswerForMulti.split(",")
            } else {
                var AnswerArr2 = ["false", "false", "false", "false"]
            }
            if (AnswerArr[optionNumber] == "true") {
                return <span className='m-2 text-success'>Right</span>
            } else {
                if (optionNumber == 0 && AnswerArr2[0] == "true") return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 1 && AnswerArr2[1] == "true") return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 2 && AnswerArr2[2] == "true") return <span className='m-2 text-danger'>Wrong</span>
                if (optionNumber == 3 && AnswerArr2[3] == "true") return <span className='m-2 text-danger'>Wrong</span>
            }
        }
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
                        Topic - {state.testDetail.Topic.Topicname}
                    </div>
                    <div className="right">
                        {
                            state.testDetail.Topic.calculatorStatus ?
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
                                        state.questionsList.map((singleQuestion, index) => {
                                            return <div className="singleQuestionPaperDetail">
                                                {
                                                    singleQuestion.subQuestion.QuestionType == "0" ?
                                                        <>
                                                            <div className="text-primary d-flex justify-content-between">
                                                                <span>Single Answer Type</span>
                                                                <span>
                                                                    <span className="text-success mx-2">+{singleQuestion.subQuestion.Marks}</span>
                                                                    <span className="text-danger">{singleQuestion.subQuestion.NegativeMarks}</span>
                                                                </span>
                                                            </div>
                                                            <div>{`Q${index + 1})`} {singleQuestion.subQuestion.Question}</div>

                                                            <h6 className="mt-2">Options : </h6>
                                                            {
                                                                singleQuestion.subQuestion.Option1 != "" ?
                                                                    <div>{`A) ${singleQuestion.subQuestion.Option1}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestion.Option2 != "" ?
                                                                    <div>{`B) ${singleQuestion.subQuestion.Option2}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestion.Option3 != "" ?
                                                                    <div>{`C) ${singleQuestion.subQuestion.Option3}`}</div> : <></>
                                                            }
                                                            {
                                                                singleQuestion.subQuestion.Option4 != "" ?
                                                                    <div>{`D) ${singleQuestion.subQuestion.Option4}`}</div> : <></>
                                                            }
                                                        </> :
                                                        singleQuestion.subQuestion.QuestionType == "1" ?
                                                            <>
                                                                <div className="text-primary d-flex justify-content-between">
                                                                    <span>Multiple Answer Type</span>
                                                                    <span>
                                                                        <span className="text-success mx-2">+{singleQuestion.subQuestion.Marks}</span>
                                                                        <span className="text-danger">{singleQuestion.subQuestion.NegativeMarks}</span>
                                                                    </span>
                                                                </div>
                                                                <div>{`Q${index + 1})`} {singleQuestion.subQuestion.Question}</div>

                                                                <h6 className="mt-2">Options : </h6>
                                                                {
                                                                    singleQuestion.subQuestion.Option1 != "" ?
                                                                        <div>{`A) ${singleQuestion.subQuestion.Option1}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestion.Option2 != "" ?
                                                                        <div>{`B) ${singleQuestion.subQuestion.Option2}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestion.Option3 != "" ?
                                                                        <div>{`C) ${singleQuestion.subQuestion.Option3}`}</div> : <></>
                                                                }
                                                                {
                                                                    singleQuestion.subQuestion.Option4 != "" ?
                                                                        <div>{`D) ${singleQuestion.subQuestion.Option4}`}</div> : <></>
                                                                }
                                                            </> :
                                                            singleQuestion.subQuestion.QuestionType == "2" ?
                                                                <>
                                                                    <div className="text-primary d-flex justify-content-between">
                                                                        <span>Numeric Type Answer</span>
                                                                        <span>
                                                                            <span className="text-success mx-2">+{singleQuestion.subQuestion.Marks}</span>
                                                                            <span className="text-danger">{singleQuestion.subQuestion.NegativeMarks}</span>
                                                                        </span>
                                                                    </div>
                                                                    <div>{`Q${index + 1})`} {singleQuestion.subQuestion.Question}</div>
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
                                    {
                                        state.questionsList.length == 0 ? <></> : <>
                                            <span className={state.questionsList[state.selectedQuestion].mainQuestion.level == "easy" ? "active" : ""}>Easy</span>
                                            <span className={state.questionsList[state.selectedQuestion].mainQuestion.level == "medium" ? "active" : ""}>Medium</span>
                                            <span className={state.questionsList[state.selectedQuestion].mainQuestion.level == "hard" ? "active" : ""}>Hard</span>
                                        </>
                                    }
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
                                        state.questionsList.length == 0 ? <></> : <>
                                            {
                                                state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "0" ? " Single Correct Answer" :
                                                    state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "1" ? " Multiple Correct Answer" : " Numeric Type Answer"
                                            }
                                        </>
                                    }
                                </div>
                                <div className="b">
                                    <span>Marks for correct answer = <b className="text-success">+{state.questionsList.length > 0 ? state.questionsList[state.selectedQuestion].subQuestion.Marks : 0}</b> and </span>
                                    <span>Negative marks = <b className="text-danger">-{state.questionsList.length > 0 ? state.questionsList[state.selectedQuestion].subQuestion.NegativeMarks : 0}</b></span>
                                </div>
                            </div>
                            {/* sub row for question type row END*/}

                            {/* sub row for question type row */}
                            <div className="sub_row border">
                                <div className="a">
                                    Question No. {state.selectedQuestion + 1}
                                </div>
                                <div className="b">
                                    Marks <b>{
                                        parseFloat(state.questionsList[state.selectedQuestion].marks) < 0 ?
                                            <span className="text-danger">{state.questionsList[state.selectedQuestion].marks}</span> : parseFloat(state.questionsList[state.selectedQuestion].marks) > 0 ?
                                                <span className="text-success">+{state.questionsList[state.selectedQuestion].marks}</span> : <span className="text-info">{state.questionsList[state.selectedQuestion].marks}</span>
                                    }</b>
                                </div>
                            </div>
                            {/* sub row for question type row END*/}

                        </div>
                        {/* questionDetailBox Start */}
                        {/* for single answer */}
                        {
                            state.questionsList.length == 0 ? <></> :
                                <>
                                    {
                                        state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "0" ?
                                            <div id="questionDetailBox">
                                                <div className="question">
                                                    {state.questionsList[state.selectedQuestion].subQuestion.Question}
                                                </div>

                                                <div className="options_div">

                                                    {
                                                        state.questionsList[state.selectedQuestion].subQuestion.Option1 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForSingle == 0 ?
                                                                        <div className="optionCircle a"><i class="fa-solid fa-check"></i></div> :
                                                                        <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op1_radio">{state.questionsList[state.selectedQuestion].subQuestion.Option1}</label>
                                                                {getRightOrWrong(0)}
                                                            </div> : <></>
                                                    }
                                                    {
                                                        state.questionsList[state.selectedQuestion].subQuestion.Option2 != "" ?

                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForSingle == 1 ?
                                                                        <div className="optionCircle a"><i class="fa-solid fa-check"></i></div> :
                                                                        <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op2_radio">{state.questionsList[state.selectedQuestion].subQuestion.Option2}</label>
                                                                {getRightOrWrong(1)}
                                                            </div> : <></>
                                                    }
                                                    {
                                                        state.questionsList[state.selectedQuestion].subQuestion.Option3 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForSingle == 2 ?
                                                                        <div className="optionCircle a"><i class="fa-solid fa-check"></i></div> :
                                                                        <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op3_radio">{state.questionsList[state.selectedQuestion].subQuestion.Option3}</label>
                                                                {getRightOrWrong(2)}
                                                            </div> : <></>}
                                                    {
                                                        state.questionsList[state.selectedQuestion].subQuestion.Option4 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    currentAnswer.CorrectAnswer == 3 ?
                                                                        <div className="optionCircle a"><i class="fa-solid fa-check"></i></div> :
                                                                        <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op4_radio">{state.questionsList[state.selectedQuestion].subQuestion.Option4}</label>
                                                                {getRightOrWrong(3)}
                                                            </div> : <></>}
                                                </div>
                                            </div> : state.questionsList[state.selectedQuestion].subQuestion.QuestionType == "1" ?
                                                //  for multiple answer 
                                                <div id="questionDetailBox">
                                                    <div className="question">
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Question}
                                                    </div>

                                                    <div className="options_div">
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Option1 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForMulti ? state.questionsList[state.selectedQuestion].submittedAnswerForMulti.split(",")[0] == "true" ?
                                                                        <div className="optionCircle a">
                                                                            <i class="fa-solid fa-check"></i>
                                                                        </div>
                                                                        :
                                                                        <div className="optionCircle"></div> :
                                                                        <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op1_checkbox">{state.questionsList[state.selectedQuestion].subQuestion.Option1}</label>
                                                                {getRightOrWrong(0)}

                                                            </div> : <></>}
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Option2 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForMulti ? state.questionsList[state.selectedQuestion].submittedAnswerForMulti.split(",")[1] == "true" ?
                                                                        <div className="optionCircle a">
                                                                            <i class="fa-solid fa-check"></i>
                                                                        </div>
                                                                        : <div className="optionCircle"></div>
                                                                        : <div className="optionCircle"></div>
                                                                }
                                                                <label htmlFor="op2_checkbox">{state.questionsList[state.selectedQuestion].subQuestion.Option2}</label>
                                                                {getRightOrWrong(1)}
                                                            </div> : <></>}
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Option2 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForMulti ? state.questionsList[state.selectedQuestion].submittedAnswerForMulti.split(",")[2] == "true" ?
                                                                        <div className="optionCircle a" >
                                                                            <i class="fa-solid fa-check"></i>
                                                                        </div>
                                                                        :
                                                                        <div className="optionCircle">
                                                                        </div> :
                                                                        <div className="optionCircle">
                                                                        </div>
                                                                }
                                                                <label htmlFor="op3_checkbox">{state.questionsList[state.selectedQuestion].subQuestion.Option3}</label>
                                                                {getRightOrWrong(2)}
                                                            </div> : <></>}
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Option4 != "" ?
                                                            <div className="option_box">
                                                                {
                                                                    state.questionsList[state.selectedQuestion].submittedAnswerForMulti ? state.questionsList[state.selectedQuestion].submittedAnswerForMulti.split(",")[3] == "true" ?
                                                                        <div className="optionCircle a">
                                                                            <i class="fa-solid fa-check"></i>
                                                                        </div>
                                                                        :
                                                                        <div className="optionCircle">
                                                                        </div>
                                                                        :
                                                                        <div className="optionCircle">
                                                                        </div>
                                                                }
                                                                <label htmlFor="op4_checkbox">{state.questionsList[state.selectedQuestion].subQuestion.Option4}</label>
                                                                {getRightOrWrong(3)}
                                                            </div> : <></>}
                                                    </div>
                                                </div> :
                                                // for numeric answer 
                                                <div id="questionDetailBox">
                                                    <div className="question">
                                                        {state.questionsList[state.selectedQuestion].subQuestion.Question}
                                                    </div>

                                                    <div className="options_div col-4">
                                                        <input type="text" readOnly value={state.questionsList[state.selectedQuestion].submittedAnswerForNumeric || ""} />
                                                    </div>
                                                    {
                                                        state.questionsList[state.selectedQuestion].submittedAnswerForNumeric ?
                                                            getNumericResult() ?
                                                                <div className='text-success m-2'>
                                                                    <b>Your answer is Right</b>
                                                                </div> :
                                                                <div className='text-danger m-2'>
                                                                    <b>Your answer is Wrong</b>
                                                                    <br />
                                                                    <b className='text-success'>Correct Answer : {state.questionsList[state.selectedQuestion].subQuestion.CorrectAnswer}</b>
                                                                </div> : <></>
                                                    }
                                                </div>
                                        //  questionDetailBox END 
                                    }
                                </>
                        }


                        {/* sub row for save and next row */}
                        <div className="sub_row bottom_save_and_next" onClick={() => {
                            document.getElementsByClassName("bottom_save_and_next")[0].classList.toggle("active")
                        }}>
                            <div className="a">
                                {
                                    state.questionsList[state.selectedQuestion].submittedStatus == 2 ?
                                        <button className="btn btn-warning">Marked for Review</button> :
                                        <button className="btn">Not Marked for review</button>
                                }
                                {/* <button className="btn" onClick={clearResponse}>
                                    Clear Response
                                </button> */}
                            </div>
                            <div className="b">
                                {
                                    state.selectedQuestion == 0 ? <></> :
                                        <button className="btn btn-primary" onClick={SaveData2}>Back</button>
                                }
                                {
                                    state.questionsList.length == state.selectedQuestion + 1 ? <></> :
                                        <button className="btn btn-primary" onClick={SaveData}>Next</button>
                                }
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
                                state.questionsList.map((question, index) => {
                                    console.log("im here with questiondetail");
                                    console.log(question)
                                    let myQuestionResults = state.questionsList[index];
                                    if (myQuestionResults.subQuestion.QuestionType == "0") {
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
                                    if (myQuestionResults.subQuestion.QuestionType == "1") {

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
                                    if (myQuestionResults.subQuestion.QuestionType == "2") {
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
                            <button className="btn btn-primary"><b>Marks : {state.testDetail.resultMarks} / {state.testDetail.totalMarks} </b></button>
                        </div>
                    </div>
                </div>


            </div>
        </div >
    );
}


export default OldQuestions;
