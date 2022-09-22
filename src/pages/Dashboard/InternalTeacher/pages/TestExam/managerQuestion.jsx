import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from "../../components/Sidebar/Sidebar";
import { setCurrentUpdatedHappyHour, setSuccessMsg } from '../../../../../services/actions/mainAction';
import { useStyles } from "../../../../../utils/useStyles";
import Heading from "../../components/Heading/Heading";
import MaterialTable from "material-table";
import { EyeIcon, DeleteIcon, EditIcon } from "../../../../../utils/Icons";
import './testExam.css'

function QuestionsManager() {
    const { admin } = useSelector((state) => state.auth);
    const { topicId } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const [isAddQuestion, setIsAddQuestion] = useState(false);
    const [waitingQuestionDispay, setWaitingQuestionDispay] = useState(false);

    const [state, setState] = useState({
        topicDetails: {},
        topicMainQuestions: [],
        selectedQuestion: null,
        subQuestionsList: [],
        fetchingSubQuestionsProgress: false,
        // questionData
        Question: "",
        QuestionImage: "",
        Solution: "",
        SolutionImage: "",
        Clue: "",
        ClueImage: "",
        questionType: "-1",
        Option1: "",
        Option1Image: "",
        Option2: "",
        Option2Image: "",
        Option3: "",
        Option3Image: "",
        Option4: "",
        Option4Image: "",
        singleOptionsList: [{}],
        multipleOptionsList: [{}],
        Answer: [false, false, false, false],
        Level: "",
        Marks: "",
        NegativeMarks: "",
        correctAnswer: "",
        rangeMin: "",
        rangeMax: "",
        updatedId: null,
    })
    const [isWait, setWait] = useState(true);

    const [imagesUrl, setImagesUrl] = useState({
        QuestionImage: "",
        SolutionImage: "",
        ClueImage: "",
        Option1Image: "",
        Option2Image: "",
        Option3Image: "",
        Option4Image: "",
    })

    const [imagesName, setImagesName] = useState({
        QuestionImage: "",
        SolutionImage: "",
        ClueImage: "",
        Option1Image: "",
        Option2Image: "",
        Option3Image: "",
        Option4Image: "",
    })

    useEffect(() => {
        setImagesUrl({
            ...imagesUrl,
            QuestionImage: "",
            SolutionImage: "",
            ClueImage: "",
            Option1Image: "",
            Option2Image: "",
            Option3Image: "",
            Option4Image: "",
        })
    }, [isAddQuestion])

    useEffect(() => {
        setImagesName({
            ...imagesName,
            QuestionImage: "",
            SolutionImage: "",
            ClueImage: "",
            Option1Image: "",
            Option2Image: "",
            Option3Image: "",
            Option4Image: "",
        })
    }, [isAddQuestion])

    useEffect(() => {
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        // Get topic details
        axios.get(`${process.env.REACT_APP_API_URI}exams/topic/${topicId}/`, config).then(response => {
            const responseData = response.data;
            console.log(responseData)
            // Get Topics main questions
            axios.get(`${process.env.REACT_APP_API_URI}exams/question/?topic=${topicId}`, config).then(response2 => {
                const responseData2 = response2.data;
                console.log(responseData2)
                setState({
                    ...state,
                    topicDetails: responseData,
                    topicMainQuestions: responseData2
                })
                setWait(false)
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })




    }, [])


    const columns = [
        { title: "No. & ID", field: "tableData.id", render: (item) => <center>{item.tableData.id + 1} <br /> <div className="text-primary">{item.id}</div> </center> },
        // {
        //     title: "Id",
        //     field: "id",
        //     cellStyle: {
        //         cellWidth: '5%'
        //     }
        // },
        // {
        //     title: "Ques", field: "questions", width: "8%",
        //     cellStyle: {
        //         cellWidth: '5%'
        //     }
        // },
        {
            title: "Level (questions)", field: "level", render: (item) => getLevelOptions(item),
        },
    ];


    const getLevelOptions = (item) => {
        return <>
            <select name="" id="" className='form-control levelQuestion' onChange={(e) => {
                // #updateLevel
                console.log(e.target.value)
                console.log("item")
                console.log(item)
                // get sub questions
                const config = {
                    headers: {
                        'Authorization': `Bearer ${admin.token}`
                    }
                }

                const data = {
                    id: item.id.toString(),
                    topic: item.topic.toString(),
                    level: e.target.value
                }

                axios.put(`${process.env.REACT_APP_API_URI}exams/question/`, data, config).then(response => {
                    const subQuestionsData = response.data;
                    dispatch(setSuccessMsg("Level Changed"))
                }).catch(err => {
                    console.log(err)
                })
            }}>
                {
                    item.level == "easy" ?
                        <option value="easy" selected>Easy ({item.questions}) </option> :
                        <option value="easy">Easy ({item.questions}) </option>
                }
                {
                    item.level == "medium" ?
                        <option value="medium" selected>Medium ({item.questions}) </option> :
                        <option value="medium">Medium ({item.questions}) </option>
                }
                {
                    item.level == "hard" ?
                        <option value="hard" selected>Hard ({item.questions}) </option> :
                        <option value="hard">Hard ({item.questions}) </option>
                }
            </select>
        </>
    }


    const actions = [
        {
            icon: EyeIcon,
            tooltip: "View",
            onClick: (event, rowData) => viewQuestion(rowData),
        },
        {
            icon: DeleteIcon,
            tooltip: "Delete",
            onClick: (event, rowData) => deleteQuestion(rowData),
        },
    ];


    const deleteQuestion = rowData => {
        if (!window.confirm("Are you want to delete this question ?")) {
            return;
        }
        axios.delete(`${process.env.REACT_APP_API_URI}exams/question/`, {
            headers: {
                Authorization: `Bearer ${admin.token}`
            },
            data: { id: rowData.id }
        }).then(() => {
            dispatch(setSuccessMsg("Question Deleted Successfully"))
            window.location.reload();
        });
    }

    const AddNewQuestion = () => {
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URI}exams/question/`,
            data: {
                topic: topicId
            },
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }).then(response => {
            dispatch(setSuccessMsg("Question Added Successfully"))
            window.location.reload();
        });

    }

    const viewQuestion = rowData => {
        setState({
            ...state,
            fetchingSubQuestionsProgress: true
        })

        // get sub questions
        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        // Get topic details
        axios.get(`${process.env.REACT_APP_API_URI}exams/subquestion/?question=${rowData.id}`, config).then(response => {
            const subQuestionsData = response.data;
            console.log("subquestions")
            console.log(subQuestionsData)
            setState({
                ...state,
                selectedQuestion: rowData,
                subQuestionsList: subQuestionsData,
                fetchingSubQuestionsProgress: false
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

    const removeImage = ImageName => {
        setImagesUrl({
            ...imagesUrl,
            [ImageName]: "",
        })
        setState({
            ...state,
            [ImageName]: ""
        })
        setImagesName({
            ...imagesName,
            [ImageName]: "",
        })
        dispatch(setSuccessMsg("Image Removed"))
    }

    const handleFile = e => {
        console.log("image target name : ")
        console.log(e.target.files[0])
        var myUrl = URL.createObjectURL(e.target.files[0]);
        setImagesUrl({
            ...imagesUrl,
            [e.target.name]: myUrl,
        })
        setImagesName({
            ...imagesName,
            [e.target.name]: e.target.files[0].name,
        })
        setState({
            ...state,
            [e.target.name]: e.target.files[0],
        })
    }

    const cancelUpdateQuestion = () => {
        getAgainQuestion()
    }
    const AddQuestion = async () => {
        if (state.questionType == "-1") {
            alert("Please Select Atleast 1 Question Type")
            return;
        }

        if (state.questionType == "0" || state.questionType == "1") {
            if (state.Answer[0] == false && state.Answer[1] == false && state.Answer[2] == false && state.Answer[3] == false) {
                alert("Please Select Atleast 1 Correct Option")
                return;
            }
        }
        const formdata = new FormData()
        formdata.append('question', state.selectedQuestion.id)
        formdata.append('Question', state.Question)
        formdata.append('QuestionImage', state.QuestionImage)
        formdata.append('Option1', state.Option1)
        formdata.append('Option1Image', state.Option1Image)
        formdata.append('Option2', state.Option2)
        formdata.append('Option2Image', state.Option2Image)
        formdata.append('Option3', state.Option3)
        formdata.append('Option3Image', state.Option3Image)
        formdata.append('Option4', state.Option4)
        formdata.append('Option4Image', state.Option4Image)
        formdata.append('Answer', state.Answer)
        formdata.append('Clue', state.Clue)
        formdata.append('ClueImage', state.Clue)
        formdata.append('Solution', state.Solution)
        formdata.append('SolutionImage', state.SolutionImage)
        formdata.append('Level', state.selectedQuestion.level)
        formdata.append('Marks', state.Marks)
        formdata.append('QuestionType', state.questionType)
        formdata.append('NegativeMarks', state.NegativeMarks)
        formdata.append('CorrectAnswer', state.correctAnswer)
        formdata.append('Rangemin', state.rangeMin)
        formdata.append('Rangemax', state.rangeMax)

        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }
        if (state.updatedId) {
            formdata.append("id", state.updatedId)
            // Get topic details
            axios.put(`${process.env.REACT_APP_API_URI}exams/subquestion/`, formdata, config).then(response => {
                const responseData = response.data;
                console.log(responseData)

                // At last update status or show questions list
                getAgainQuestion()
            }).catch(err => {
                console.log(err)
            })
        } else {
            // Get topic details
            axios.post(`${process.env.REACT_APP_API_URI}exams/subquestion/`, formdata, config).then(response => {
                const responseData = response.data;
                console.log(responseData)
                // update question number 
                var oldQuestion = state.topicMainQuestions;
                oldQuestion[state.selectedQuestion.tableData.id].questions++;
                setState({
                    ...state,
                    topicMainQuestions: oldQuestion
                })
                // update question number end

                getAgainQuestion()
            }).catch(err => {
                console.log(err)
            })
        }




    }

    const getAgainQuestion = () => {
        // get all subQuestions
        setWaitingQuestionDispay(true)

        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }

        // get sub questions
        axios.get(`${process.env.REACT_APP_API_URI}exams/subquestion/?question=${state.selectedQuestion.id}`, config).then(response => {
            const subQuestionsData = response.data;
            console.log("subquestions get again data")
            console.log(subQuestionsData)
            var oldMainQuestions = state.topicMainQuestions;

            setState({
                ...state,
                subQuestionsList: subQuestionsData,
                selectedQuestion: state.selectedQuestion,
                // fetchingSubQuestionsProgress: false,
                Question: "",
                QuestionImage: "",
                Solution: "",
                SolutionImage: "",
                Clue: "",
                ClueImage: "",
                questionType: "-1",
                Option1: "",
                Option1Image: "",
                Option2: "",
                Option2Image: "",
                Option3: "",
                Option3Image: "",
                Option4: "",
                Option4Image: "",
                singleOptionsList: [{}],
                multipleOptionsList: [{}],
                Answer: [false, false, false, false],
                Level: "",
                Marks: "",
                NegativeMarks: "",
                correctAnswer: "",
                rangeMin: "",
                rangeMax: "",
                updatedId: null,

            })
            setIsAddQuestion(false)
            setTimeout(() => {
                setWaitingQuestionDispay(false)
            }, 500);
        }).catch(err => {
            console.log(err)
        })
    }

    // #deletesubQuestion
    const deleteSubQuestion = (subQuestion) => {
        console.log(subQuestion);

        const config = {
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        }

        axios.delete(`${process.env.REACT_APP_API_URI}exams/subquestion/?id=${subQuestion.id}`, config).then(response => {
            const responseData = response.data;
            console.log(responseData)

            // At last update status or show questions list
            getAgainQuestion();
            setIsAddQuestion(false)
        }).catch(err => {
            console.log(err.response.data)
        })
    }


    const updateQuestion = (subQuestion) => {
        console.log("subQuestion");
        console.log(subQuestion);
        let optionCount = 0;
        if (subQuestion.Option1 != "") {
            optionCount++;
        }
        if (subQuestion.Option2 != "") {
            optionCount++;
        }
        if (subQuestion.Option3 != "") {
            optionCount++;
        }
        if (subQuestion.Option4 != "") {
            optionCount++;
        }
        let OptionsFields = []
        let i = 1;
        if (optionCount == 0) {

            let SingleOptions = []
            let MultipleOptions = []
            if (subQuestion.QuestionType == "0") {
                SingleOptions = OptionsFields
            }
            if (subQuestion.QuestionType == "1") {
                MultipleOptions = OptionsFields
            }

            setState({
                ...state,
                Question: subQuestion.Question || "",
                QuestionImage: subQuestion.QuestionImage || "",
                Solution: subQuestion.Solution || "",
                SolutionImage: subQuestion.SolutionImage || "",
                questionType: subQuestion.QuestionType,
                Option1: subQuestion.Option1 || "",
                Option1Image: subQuestion.Option1Image || "",
                Option2: subQuestion.Option2 || "",
                Option2Image: subQuestion.Option2Image || "",
                Option3: subQuestion.Option3 || "",
                Option3Image: subQuestion.Option3Image || "",
                Option4: subQuestion.Option4 || "",
                Option4Image: subQuestion.Option4Image || "",
                singleOptionsList: SingleOptions,
                multipleOptionsList: MultipleOptions,
                Answer: subQuestion.Answer,
                Clue: subQuestion.Clue || "",
                Level: subQuestion.Level || "",
                Marks: subQuestion.Marks || "",
                NegativeMarks: subQuestion.NegativeMarks == null ? "" : subQuestion.NegativeMarks,
                correctAnswer: subQuestion.CorrectAnswer || "",
                rangeMin: subQuestion.Rangemin || "",
                rangeMax: subQuestion.Rangemax || "",
                updatedId: subQuestion.id
            })

            setIsAddQuestion(true)

        } else {
            while (i <= optionCount) {
                OptionsFields.push({})
                i++
                if (i == optionCount) {
                    let SingleOptions = []
                    let MultipleOptions = []
                    if (subQuestion.QuestionType == "0") {
                        SingleOptions = OptionsFields
                    }
                    if (subQuestion.QuestionType == "1") {
                        MultipleOptions = OptionsFields
                    }

                    setState({
                        ...state,
                        Question: subQuestion.Question || "",
                        QuestionImage: subQuestion.QuestionImage || "",
                        Solution: subQuestion.Solution || "",
                        SolutionImage: subQuestion.SolutionImage || "",
                        questionType: subQuestion.QuestionType,
                        Option1: subQuestion.Option1 || "",
                        Option1Image: subQuestion.Option1Image || "",
                        Option2: subQuestion.Option2 || "",
                        Option2Image: subQuestion.Option2Image || "",
                        Option3: subQuestion.Option3 || "",
                        Option3Image: subQuestion.Option3Image || "",
                        Option4: subQuestion.Option4 || "",
                        Option4Image: subQuestion.Option4Image || "",
                        singleOptionsList: SingleOptions,
                        multipleOptionsList: MultipleOptions,
                        Answer: subQuestion.Answer,
                        Clue: subQuestion.Clue || "",
                        Level: subQuestion.Level || "",
                        Marks: subQuestion.Marks || "",
                        NegativeMarks: subQuestion.NegativeMarks == null ? "" : subQuestion.NegativeMarks,
                        correctAnswer: subQuestion.CorrectAnswer || "",
                        rangeMin: subQuestion.Rangemin || "",
                        rangeMax: subQuestion.Rangemax || "",
                        updatedId: subQuestion.id
                    })

                    setIsAddQuestion(true)
                }
            }
        }


    }

    const openPreview = (subQuestion) => {
        window.open('/guest/preview/' + subQuestion.id, '_blank');
    }

    if (isWait) {
        return <>
            <center style={{ "paddingTop": "50px" }}>
                <div class="spinner-border"></div>
                <p>Getting Topic details...</p>
            </center>
        </>
    }

    return (
        <div>
            <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Heading headingTitle={`ID - ${topicId} ${state.topicDetails.Topicname}(Subject - ${state.topicDetails.subject.subject})`} />
                    <div className='card_box questionManager' id='testExam'>
                        <div className="left">
                            <button className="btn btn-success" onClick={AddNewQuestion}>Add New Question</button>
                            <MaterialTable
                                options={{
                                    paging: false,
                                    actionsColumnIndex: -1,
                                    paginationType: "stepped",
                                    exportButton: false,
                                    pageSize: 1000,
                                    search: false,
                                    tableLayout: "auto",
                                }}
                                localization={{
                                    header: {
                                        actions: 'ACTION'
                                    },
                                }}
                                data={state.topicMainQuestions && state.topicMainQuestions}
                                columns={columns && columns}
                                title=""
                                onRowClick={(event, rowData) => console.log(rowData)}
                                actions={actions && actions}
                                className="mainQuestionTable"
                            />
                        </div>
                        <div className="right">
                            {/* page 1 & 2 */}
                            {
                                state.selectedQuestion == null ?
                                    <>
                                        <div className="d-flex align-items-center justify-content-center col-12 pt-3">
                                            <h3 className="text-danger">Please select a question</h3>
                                        </div>
                                    </> :
                                    !isAddQuestion ?
                                        <div className='showAllQuestion'>

                                            {/* description about this question*/}
                                            {/* there are 4 question and you can add more */}

                                            <div className="top">
                                                <div className="float-right">
                                                    <button className="btn btn-success" onClick={() => setIsAddQuestion(true)}>Add Subquestion</button>
                                                </div>
                                            </div>

                                            {
                                                state.fetchingSubQuestionsProgress || waitingQuestionDispay ?
                                                    <>
                                                        <center style={{ "paddingTop": "50px" }}>
                                                            <div class="spinner-border"></div>
                                                            <p>We are finding sub-questions...</p>
                                                        </center>
                                                    </> :
                                                    <>
                                                        {
                                                            state.subQuestionsList.length == 0 ?
                                                                <>
                                                                    <center class="text-danger">
                                                                        No Question
                                                                    </center>
                                                                </> : <></>
                                                        }
                                                        {
                                                            state.subQuestionsList.map((subQuestion, index) => {
                                                                console.log("#subQuestion")
                                                                console.log(subQuestion)
                                                                if (typeof subQuestion.Answer === "string") {
                                                                    subQuestion.Answer = subQuestion.Answer.split(",")
                                                                }
                                                                if (subQuestion.Answer[0] == 'true') subQuestion.Answer[0] = true
                                                                else subQuestion.Answer[0] = false

                                                                if (subQuestion.Answer[1] == 'true') subQuestion.Answer[1] = true
                                                                else subQuestion.Answer[1] = false

                                                                if (subQuestion.Answer[2] == 'true') subQuestion.Answer[2] = true
                                                                else subQuestion.Answer[2] = false

                                                                if (subQuestion.Answer[3] == 'true') subQuestion.Answer[3] = true
                                                                else subQuestion.Answer[3] = false



                                                                return (
                                                                    <>
                                                                        {
                                                                            subQuestion.QuestionType == "0" ?
                                                                                <>
                                                                                    {/* question 1 single choice question */}
                                                                                    <div className="sub_question_dtl">
                                                                                        <div className='d-flex justify-content-between col-12 p-2'>
                                                                                            <div>
                                                                                                <span className='subQuestionId'>ID: {subQuestion.id} (Single Correct Answer)</span>
                                                                                            </div>
                                                                                            <div className='iconsHover'>
                                                                                                <span onClick={() => openPreview(subQuestion)}>
                                                                                                    <EyeIcon />
                                                                                                </span>
                                                                                                <span onClick={() => updateQuestion(subQuestion)}>
                                                                                                    <EditIcon />
                                                                                                </span>
                                                                                                <span onClick={() => deleteSubQuestion(subQuestion)}>
                                                                                                    <DeleteIcon />
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='qq'>
                                                                                            <span className='q_row'>
                                                                                                <span>Question: </span>
                                                                                                <p>{subQuestion.Question}</p>
                                                                                            </span>
                                                                                            {/* manage question */}

                                                                                        </div>
                                                                                        <div className='qq mt-1 d-flex'>
                                                                                            <div className="q_row">
                                                                                                <span>Solution : </span>
                                                                                                <p>{subQuestion.Solution}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            subQuestion.Clue == null ? <> </> :
                                                                                                <div className='qq mt-1 d-flex'>
                                                                                                    <div className="q_row">
                                                                                                        <span>Clue : </span>
                                                                                                        <p>{subQuestion.Clue}</p>
                                                                                                    </div>

                                                                                                </div>
                                                                                        }
                                                                                        {/* options 4 */}
                                                                                        <div className='opp'>
                                                                                            <div className="qq">
                                                                                                <div className="q_row">
                                                                                                    Options:
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                subQuestion.Option1 != "" ? <p className={subQuestion.Answer[0] == true ? "correct" : ""}> <span>(1)</span> {subQuestion.Option1}</p> : <></>
                                                                                            }
                                                                                            {
                                                                                                subQuestion.Option2 != "" ? <p className={subQuestion.Answer[1] == true ? "correct" : ""}> <span>(2)</span> {subQuestion.Option2}</p> : <></>
                                                                                            }
                                                                                            {
                                                                                                subQuestion.Option3 != "" ? <p className={subQuestion.Answer[2] == true ? "correct" : ""}> <span>(3)</span> {subQuestion.Option3}</p> : <></>
                                                                                            }
                                                                                            {
                                                                                                subQuestion.Option4 != "" ? <p className={subQuestion.Answer[3] == true ? "correct" : ""}> <span>(4)</span> {subQuestion.Option4}</p> : <></>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                                : subQuestion.QuestionType == "1" ?
                                                                                    <>
                                                                                        {/* question 2 multiple choice*/}
                                                                                        <div className="sub_question_dtl">
                                                                                            <div className='d-flex justify-content-between col-12 p-2'>
                                                                                                <div>
                                                                                                    <span className='subQuestionId'>ID: {subQuestion.id} (Multiple Correct Answer)</span>
                                                                                                </div>
                                                                                                <div className='iconsHover'>
                                                                                                    <span onClick={() => openPreview(subQuestion)}>
                                                                                                        <EyeIcon />
                                                                                                    </span>
                                                                                                    <span onClick={() => updateQuestion(subQuestion)}>
                                                                                                        <EditIcon />
                                                                                                    </span>
                                                                                                    <span onClick={() => deleteSubQuestion(subQuestion)}>
                                                                                                        <DeleteIcon />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='qq'>
                                                                                                <span className='q_row'>
                                                                                                    <span>Question: </span>
                                                                                                    <p>{subQuestion.Question}</p>
                                                                                                </span>
                                                                                                {/* manage question */}

                                                                                            </div>
                                                                                            <div className='qq mt-1 d-flex'>
                                                                                                <div className="q_row">
                                                                                                    <span>Solution : </span>
                                                                                                    <p>{subQuestion.Solution}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                subQuestion.Clue == null ? <> </> :
                                                                                                    <div className='qq mt-1 d-flex'>
                                                                                                        <div className="q_row">
                                                                                                            <span>Clue : </span>
                                                                                                            <p>{subQuestion.Clue}</p>
                                                                                                        </div>

                                                                                                    </div>
                                                                                            }
                                                                                            {/* options 4 */}
                                                                                            <div className='opp'>
                                                                                                <div className="qq">
                                                                                                    <div className="q_row">
                                                                                                        Options:
                                                                                                    </div>
                                                                                                </div>
                                                                                                {
                                                                                                    subQuestion.Option1 != "" ? <p className={subQuestion.Answer[0] == true ? "correct" : ""}> <span>(1)</span> {subQuestion.Option1}</p> : <></>
                                                                                                }
                                                                                                {
                                                                                                    subQuestion.Option2 != "" ? <p className={subQuestion.Answer[1] == true ? "correct" : ""}> <span>(2)</span> {subQuestion.Option2}</p> : <></>
                                                                                                }
                                                                                                {
                                                                                                    subQuestion.Option3 != "" ? <p className={subQuestion.Answer[2] == true ? "correct" : ""}> <span>(3)</span> {subQuestion.Option3}</p> : <></>
                                                                                                }
                                                                                                {
                                                                                                    subQuestion.Option4 != "" ? <p className={subQuestion.Answer[3] == true ? "correct" : ""}> <span>(4)</span> {subQuestion.Option4}</p> : <></>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                    : subQuestion.QuestionType == "2" ?
                                                                                        <>
                                                                                            {/* question 3 numeric type */}
                                                                                            <div className="sub_question_dtl">
                                                                                                <div className='d-flex justify-content-between col-12 p-2'>
                                                                                                    <div>
                                                                                                        <span className='subQuestionId'>ID: {subQuestion.id} (Numeric Answer Type)</span>
                                                                                                    </div>
                                                                                                    <div className='iconsHover'>
                                                                                                        <span onClick={() => openPreview(subQuestion)}>
                                                                                                            <EyeIcon />
                                                                                                        </span>
                                                                                                        <span onClick={() => updateQuestion(subQuestion)}>
                                                                                                            <EditIcon />
                                                                                                        </span>
                                                                                                        <span onClick={() => deleteSubQuestion(subQuestion)}>
                                                                                                            <DeleteIcon />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='qq'>
                                                                                                    <span className='q_row'>
                                                                                                        <span>Question: </span>
                                                                                                        <p>{subQuestion.Question}</p>
                                                                                                    </span>
                                                                                                    {/* manage question */}

                                                                                                </div>
                                                                                                <div className='qq mt-1 d-flex'>
                                                                                                    <div className="q_row">
                                                                                                        <span>Solution : </span>
                                                                                                        <p>{subQuestion.Solution}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {
                                                                                                    subQuestion.Clue == null ? <> </> :
                                                                                                        <div className='qq mt-1 d-flex'>
                                                                                                            <div className="q_row">
                                                                                                                <span>Clue : </span>
                                                                                                                <p>{subQuestion.Clue}</p>
                                                                                                            </div>

                                                                                                        </div>
                                                                                                }
                                                                                                {/* options 4 */}
                                                                                                <div className='opp'>
                                                                                                    <p className='correct'>Correct Answer : <span>{subQuestion.CorrectAnswer}</span></p>
                                                                                                    <p>Minimum : {subQuestion.Rangemin || "0"}</p>
                                                                                                    <p>Maximum : {subQuestion.Rangemax || "0"}</p>
                                                                                                </div>

                                                                                            </div>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <h4 className="text-danger">Question Type is wrong</h4>
                                                                                        </>
                                                                        }
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </>
                                            }
                                        </div>
                                        : <div className='insertNewQuestion'>
                                            <div className='form-add-question'>

                                                <h2 className='mb-3'>Question </h2>

                                                {/* question field */}
                                                <div class="form-floating mb-3">
                                                    <textarea name="Question" onChange={onchange} class="form-control" placeholder="Type Question Here..." id="floatingTextarea" style={{ "height": "100px" }}>{state.Question}</textarea>
                                                    <label for="floatingTextarea">Type Question Here..</label>
                                                </div>
                                                <div className="my-3 imageUploadIcon d-flex align-items-center">
                                                    <label for="QuestionImage" class="form-label mr-2"><i class="fa fa-upload" aria-hidden="true"></i> <span>
                                                        {
                                                            imagesUrl.QuestionImage != "" ?
                                                                <>Change Image</>
                                                                :
                                                                <>Image Upload</>
                                                        }

                                                    </span> </label>
                                                    <input class="form-control" type="file" name='QuestionImage' id='QuestionImage' onChange={handleFile} />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {
                                                        imagesUrl.QuestionImage != "" ?
                                                            <>
                                                                {/* <img src={imagesUrl.QuestionImage} alt="" height={"35px"} style={{ marginLeft: "5px" }} /> */}
                                                                <p className='uploadedImageName m-2'>{imagesName.QuestionImage}</p>
                                                                <div className="removeImage text-danger m-2" onClick={() => removeImage("QuestionImage")}>
                                                                    <i className='fa fa-times'></i>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </div>

                                                <h2 className='mb-3 mt-3'>Solution </h2>
                                                {/* question field */}
                                                <div class="form-floating mb-3">
                                                    <textarea name="Solution" onChange={onchange} class="form-control" placeholder="Type Solution Here..." id="floatingTextarea" style={{ "height": "100px" }}>{state.Solution}</textarea>
                                                    <label for="floatingTextarea">Type Solution Here...</label>
                                                </div>
                                                <div className="my-3 imageUploadIcon">
                                                    <label for="SolutionImage" class="form-label"><i class="fa fa-upload" aria-hidden="true"></i> <span>
                                                        {
                                                            imagesUrl.SolutionImage != "" ?
                                                                <>Change Image</>
                                                                :
                                                                <>Image Upload</>
                                                        }
                                                    </span> </label>
                                                    <input class="form-control" type="file" name='SolutionImage' id='SolutionImage' onChange={handleFile} />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {
                                                        imagesUrl.SolutionImage != "" ?
                                                            <>
                                                                {/* <img src={imagesUrl.SolutionImage} alt="" height={"35px"} style={{ marginLeft: "5px" }} /> */}
                                                                <p className='uploadedImageName m-2'>{imagesName.SolutionImage}</p>
                                                                <div className="removeImage text-danger m-2" onClick={() => removeImage("SolutionImage")}>
                                                                    <i className='fa fa-times'></i>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </div>

                                                <h2 className='mb-3 mt-3'>Clue </h2>
                                                {/* question field */}
                                                <div class="form-floating mb-3">
                                                    <textarea name="Clue" onChange={onchange} class="form-control" placeholder="Type Solution Here..." id="floatingTextarea" style={{ "height": "100px" }}>{state.Clue}</textarea>
                                                    <label for="floatingTextarea">Type Clue Here...</label>
                                                </div>
                                                <div className="my-3 imageUploadIcon">
                                                    <label for="ClueImage" class="form-label"><i class="fa fa-upload" aria-hidden="true"></i> <span>
                                                        {
                                                            imagesUrl.ClueImage != "" ?
                                                                <>Change Image</>
                                                                :
                                                                <>Image Upload</>
                                                        }
                                                    </span> </label>
                                                    <input class="form-control" type="file" name='ClueImage' id='ClueImage' onChange={handleFile} />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {
                                                        imagesUrl.ClueImage != "" ?
                                                            <>
                                                                {/* <img src={imagesUrl.ClueImage} alt="" height={"35px"} style={{ marginLeft: "5px" }} /> */}
                                                                <p className='uploadedImageName m-2'>{imagesName.ClueImage}</p>
                                                                <div className="removeImage text-danger m-2" onClick={() => removeImage("ClueImage")}>
                                                                    <i className='fa fa-times'></i>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                                <hr />
                                                <h4 className='mb-3 mt-3'>Answer Type </h4>
                                                <div class="form-check">
                                                    {
                                                        state.questionType == "0" ?
                                                            <input checked class="form-check-input" type="radio" id="flexRadioDefault1" name="questionType" onChange={onchange} value="0" /> :
                                                            <input class="form-check-input" type="radio" id="flexRadioDefault1" name="questionType" onChange={onchange} value="0" />
                                                    }
                                                    <label class="form-check-label" htmlFor="flexRadioDefault1">
                                                        Single Correct Answer
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    {
                                                        state.questionType == "1" ?
                                                            <input checked class="form-check-input" type="radio" id="flexRadioDefault2" name="questionType" onChange={onchange} value="1" /> :
                                                            <input class="form-check-input" type="radio" id="flexRadioDefault2" name="questionType" onChange={onchange} value="1" />
                                                    }
                                                    <label class="form-check-label" htmlFor="flexRadioDefault2">
                                                        Multiple Correct Answer
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    {
                                                        state.questionType == "2" ?
                                                            <input checked class="form-check-input" type="radio" id="flexRadioDefault3" name="questionType" onChange={onchange} value="2" /> :
                                                            <input class="form-check-input" type="radio" id="flexRadioDefault3" name="questionType" onChange={onchange} value="2" />
                                                    }
                                                    <label class="form-check-label" htmlFor="flexRadioDefault3">
                                                        Numerical Answer Type
                                                    </label>
                                                </div>

                                                {
                                                    state.questionType == "0" ?
                                                        <>
                                                            <h4 className='mb-3 mt-3'>Options</h4>
                                                            <p>Tick the correct answer.</p>
                                                            <hr />
                                                            {/* here are n-options field with checkbox */}
                                                            {
                                                                state.singleOptionsList.map((optionData, index) => {
                                                                    const getValue = () => {
                                                                        if (index == 0) return state.Option1;
                                                                        if (index == 1) return state.Option2;
                                                                        if (index == 2) return state.Option3;
                                                                        if (index == 3) return state.Option4;
                                                                    }
                                                                    const getImageUrl = () => {
                                                                        if (index == 0) return imagesUrl.Option1Image;
                                                                        if (index == 1) return imagesUrl.Option2Image;
                                                                        if (index == 2) return imagesUrl.Option3Image;
                                                                        if (index == 3) return imagesUrl.Option4Image;
                                                                    }
                                                                    const getImageName = () => {
                                                                        if (index == 0) return imagesName.Option1Image;
                                                                        if (index == 1) return imagesName.Option2Image;
                                                                        if (index == 2) return imagesName.Option3Image;
                                                                        if (index == 3) return imagesName.Option4Image;
                                                                    }
                                                                    const getOptionName = () => {
                                                                        if (index == 0) return "Option1Image";
                                                                        if (index == 1) return "Option2Image";
                                                                        if (index == 2) return "Option3Image";
                                                                        if (index == 3) return "Option4Image";
                                                                    }
                                                                    return (
                                                                        <>
                                                                            <div class="form mb-3">
                                                                                <label for="floatingInput">Option ({index + 1})</label>
                                                                                <div className="op_row">
                                                                                    <input type="text" class="form-control" id="floatingInput" placeholder="" name={`Option` + (index + 1)} onChange={onchange} value={getValue()} />
                                                                                    {
                                                                                        state.Answer[index] == true ?
                                                                                            <input checked type="checkbox" value="on" name="Answer" onChange={(e) => {
                                                                                                let OldData = [false, false, false, false];
                                                                                                OldData[index] = !OldData[index]
                                                                                                setState({
                                                                                                    ...state,
                                                                                                    Answer: OldData
                                                                                                })
                                                                                            }} /> :
                                                                                            <input type="checkbox" value="on" name="Answer" onChange={(e) => {
                                                                                                let OldData = [false, false, false, false];
                                                                                                OldData[index] = !OldData[index]
                                                                                                setState({
                                                                                                    ...state,
                                                                                                    Answer: OldData
                                                                                                })
                                                                                            }} />
                                                                                    }
                                                                                    <div className="deleteOptionBtn" onClick={() => {
                                                                                        // delete this option from optionsList state
                                                                                        if (state.singleOptionsList.length == 1) {
                                                                                            alert("Minimum 1 option is required");
                                                                                            return;
                                                                                        }
                                                                                        let oldOptions = state.singleOptionsList;
                                                                                        oldOptions.splice(index, 1);
                                                                                        setState({
                                                                                            ...state,
                                                                                            singleOptionsList: oldOptions
                                                                                        })
                                                                                    }}>
                                                                                        <i className='fa-solid fa-trash'></i>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="my-3 imageUploadIcon">
                                                                                    <label htmlFor={`Option` + (index + 1) + `Image`} class="form-label"><i class="fa fa-upload" aria-hidden="true"></i> <span>
                                                                                        {
                                                                                            getImageUrl() != "" ?
                                                                                                <>Change Image</>
                                                                                                :
                                                                                                <>Image Upload</>
                                                                                        }
                                                                                    </span> </label>
                                                                                    <input class="form-control" type="file" name={`Option` + (index + 1) + `Image`} id={`Option` + (index + 1) + `Image`} onChange={handleFile} />
                                                                                </div>
                                                                                <div className="d-flex align-items-center">
                                                                                    {
                                                                                        getImageName() != "" ?
                                                                                            <>
                                                                                                {/* <img src={getImageUrl()} alt="" height={"35px"} style={{ marginLeft: "5px" }} /> */}
                                                                                                <p className='uploadedImageName m-2'>{getImageName()}</p>
                                                                                                <div className="removeImage text-danger m-2" onClick={() => removeImage(getOptionName())}>
                                                                                                    <i className='fa fa-times'></i>
                                                                                                </div>
                                                                                                {/* <div className="removeImage text-danger m-2" onClick={() => removeImage(getOptionName())}>Remove</div> */}
                                                                                            </>
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                })
                                                            }


                                                            <div className="addOptionBtn" onClick={() => {
                                                                var countOptions = state.singleOptionsList.length;
                                                                var newOption = {}
                                                                if (countOptions == 4) {
                                                                    alert("Sorry, Maxium four options are allowed")
                                                                    return;
                                                                }

                                                                setState({
                                                                    ...state,
                                                                    singleOptionsList: [...state.singleOptionsList, newOption]
                                                                })
                                                            }}>
                                                                <i className='fa-solid fa-add'></i>
                                                                <span>Add Option</span>
                                                            </div>
                                                        </> : state.questionType == "1" ?
                                                            <>
                                                                <h4 className='mb-3 mt-3'>Options</h4>
                                                                <p>Tick the correct answers.</p>
                                                                <hr />
                                                                {
                                                                    state.multipleOptionsList.map((optionData, index) => {
                                                                        const getValue = () => {
                                                                            if (index == 0) return state.Option1;
                                                                            if (index == 1) return state.Option2;
                                                                            if (index == 2) return state.Option3;
                                                                            if (index == 3) return state.Option4;
                                                                        }
                                                                        const getImageName = () => {
                                                                            if (index == 0) return imagesName.Option1Image;
                                                                            if (index == 1) return imagesName.Option2Image;
                                                                            if (index == 2) return imagesName.Option3Image;
                                                                            if (index == 3) return imagesName.Option4Image;
                                                                        }
                                                                        const getOptionName = () => {
                                                                            if (index == 0) return "Option1Image";
                                                                            if (index == 1) return "Option2Image";
                                                                            if (index == 2) return "Option3Image";
                                                                            if (index == 3) return "Option4Image";
                                                                        }

                                                                        return (
                                                                            <>
                                                                                <div class="form mb-3">
                                                                                    <label for="floatingInput">Option ({index + 1})</label>
                                                                                    <div className="op_row">
                                                                                        <input type="text" class="form-control" id="floatingInput" placeholder="" name={`Option` + (index + 1)} onChange={onchange} value={getValue()} />
                                                                                        {
                                                                                            state.Answer[index] == true ?
                                                                                                <input checked type="checkbox" value="on" name="Answer" onChange={(e) => {
                                                                                                    let OldData = state.Answer;
                                                                                                    OldData[index] = !OldData[index]
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        Answer: OldData
                                                                                                    })
                                                                                                }} /> :
                                                                                                <input type="checkbox" value="on" name="Answer" onChange={(e) => {
                                                                                                    let OldData = state.Answer;
                                                                                                    OldData[index] = !OldData[index]
                                                                                                    setState({
                                                                                                        ...state,
                                                                                                        Answer: OldData
                                                                                                    })
                                                                                                }} />

                                                                                        }

                                                                                        <div className="deleteOptionBtn" onClick={() => {
                                                                                            // delete this option from optionsList state
                                                                                            if (state.multipleOptionsList.length == 1) {
                                                                                                alert("Minimum 1 option is required");
                                                                                                return;
                                                                                            }
                                                                                            let oldOptions = state.multipleOptionsList;
                                                                                            oldOptions.splice(index, 1);
                                                                                            setState({
                                                                                                ...state,
                                                                                                multipleOptionsList: oldOptions
                                                                                            })
                                                                                        }}>
                                                                                            <i className='fa-solid fa-trash'></i>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="my-3 imageUploadIcon">
                                                                                        <label htmlFor={`Option` + (index + 1) + `Image`} class="form-label"><i class="fa fa-upload" aria-hidden="true"></i> <span>Image Upload</span> </label>
                                                                                        <input class="form-control" type="file" name={`Option` + (index + 1) + `Image`} id={`Option` + (index + 1) + `Image`} onChange={handleFile} />
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center">
                                                                                        {
                                                                                            getImageName() != "" ?
                                                                                                <>
                                                                                                    {/* <img src={getImageUrl()} alt="" height={"35px"} style={{ marginLeft: "5px" }} /> */}
                                                                                                    <p className='uploadedImageName m-2'>{getImageName()}</p>
                                                                                                    <div className="removeImage text-danger m-2" onClick={() => removeImage(getOptionName())}>
                                                                                                        <i className='fa fa-times'></i>
                                                                                                    </div>
                                                                                                    {/* <div className="removeImage text-danger m-2" onClick={() => removeImage(getOptionName())}>Remove</div> */}
                                                                                                </>
                                                                                                :
                                                                                                <></>
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                            </>
                                                                        )
                                                                    })
                                                                }

                                                                <div className="addOptionBtn" onClick={() => {
                                                                    var countOptions = state.multipleOptionsList.length;
                                                                    var newOption = {}
                                                                    if (countOptions == 4) {
                                                                        alert("Sorry, Maxium four options are allowed")
                                                                        return;
                                                                    }

                                                                    setState({
                                                                        ...state,
                                                                        multipleOptionsList: [...state.multipleOptionsList, newOption]
                                                                    })
                                                                }}>
                                                                    <i className='fa-solid fa-add'></i>
                                                                    <span>Add Option</span>
                                                                </div>
                                                            </> : state.questionType == "2" ?
                                                                <>
                                                                    <hr />
                                                                    {/* here are n-options field with checkbox */}

                                                                    <div class="form mb-3">
                                                                        <label for="floatingInput">Correct Answer</label>
                                                                        <input type="number" name="correctAnswer" value={state.correctAnswer} onChange={onchange} class="form-control" id="floatingInput" placeholder="" />
                                                                    </div>

                                                                    <label for="floatingInput">Range Of Answer To Be Shown Correct </label>
                                                                    <div className="to_row mb-3">
                                                                        <div class="form">
                                                                            <input type="number" class="form-control" name="rangeMin" value={state.rangeMin} onChange={onchange} id="floatingInput" placeholder="" />
                                                                        </div>
                                                                        <span className="toBox">
                                                                            TO
                                                                        </span>
                                                                        <div class="form">
                                                                            <input type="number" class="form-control" name="rangeMax" value={state.rangeMax} onChange={onchange} id="floatingInput" placeholder="" />
                                                                        </div>
                                                                    </div>

                                                                    <b><p>* If the correct answer is 29.22, then the range of answer to be shown correct can be 29.00 to 29.49</p></b>

                                                                </> : <div></div>
                                                }

                                                <hr />

                                                {/* marks-1 correct marks field */}
                                                <div class="form mb-3 mt-3">
                                                    <label for="floatingInput">Marks</label>
                                                    <input type="number" class="form-control" min="0" id="floatingInput" name="Marks" onChange={onchange} value={state.Marks} />
                                                </div>
                                                {/* marks-2 negative marks field */}
                                                <div class="form mb-3 mt-3">
                                                    <label for="floatingInput">Negative Marking</label>
                                                    <input type="number" class="form-control" min="0" id="floatingInput" name="NegativeMarks" onChange={onchange} value={state.NegativeMarks} />
                                                </div>
                                                <div class="form-check mb-3">
                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={() => alert("This is pending...")} />
                                                    <label class="form-check-label" for="flexCheckDefault">
                                                        Check Your Question Is Unique Or Not
                                                    </label>
                                                </div>
                                                <div className='btns-list'>
                                                    <button
                                                        onClick={() => cancelUpdateQuestion()}
                                                        className="btn btn-danger">Cancel</button>
                                                    <span>
                                                        {/* <button className="btn btn-primary mx-3">Preview</button> */}
                                                        <button className="btn btn-success" onClick={() => AddQuestion()}>{state.updatedId ? "Update" : "Add"}</button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                            }
                        </div>
                    </div >
                </main >
            </div >
        </div >
    )
}

export default QuestionsManager;