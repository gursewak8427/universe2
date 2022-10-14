import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import ErrorPage from "./components/ErrorPage/ErrorPage";

import "./App.css";
import PrivateRoute from "./HOC/PrivateRoute/PrivateRoute";
import RedirectRoute from "./HOC/PrivateRoute/RedirectRoute";
import { getAuthentication, getEmail } from "./helper/Cookies";
import { LOGIN } from "./services/constants/AuthConstants";
import ToastHandler2 from "./components/toastHandler.jsx";
import Home from "./pages/Home/Home.jsx";
import InternalTeacherLogin from "./pages/Home/InternalTeacher/InternalTeacher_login";
import InternalTeacherSignUp from "./pages/Home/InternalTeacher/InternalTeacher";
import InternalTeacherDashboard from "./pages/Dashboard/InternalTeacher/dashboard";
import TopicManage from "./pages/Dashboard/InternalTeacher/pages/topics/topics";
import CreateTopic from "./pages/Dashboard/InternalTeacher/pages/topics/createTopic";
import SelectTopic from "./pages/Dashboard/InternalTeacher/pages/TestExam/selectTopic";
import QuestionsManager from "./pages/Dashboard/InternalTeacher/pages/TestExam/managerQuestion";
import ChapterManage from "./pages/Dashboard/InternalTeacher/pages/chapters/chapter";
import CreateChapter from "./pages/Dashboard/InternalTeacher/pages/chapters/createChapter";
import { loginNow } from "./services/actions/auth.action";
import { setClasses, setSubjects, setTotalTest, setWalletData } from "./services/actions/mainAction";
import axios from "axios";
import StudentLogin from "./pages/Home/Student/Student_login";
import StudentSignUp from "./pages/Home/Student/StudentSignUp";
import StudentDashboard from "./pages/Dashboard/Student/dashboard";
import GetTest from "./pages/Dashboard/Student/pages/StartTest/getTest";
import StartTest from "./pages/Dashboard/Student/pages/StartTest/startTest";
import MainTopic from "./pages/Dashboard/InternalTeacher/pages/mainTopics/mainTopic";
import CreateMainTopic from "./pages/Dashboard/InternalTeacher/pages/mainTopics/createMainTopic";
import Preview from "./pages/Dashboard/InternalTeacher/pages/TestExam/preview";
import Questions from "./pages/Dashboard/Student/pages/StartTest/questions";
import OldTestResults from "./pages/Dashboard/Student/pages/oldTest/oldTestResults";
import OldQuestions from "./pages/Dashboard/Student/pages/oldTest/oldquestions";

// firebase
import { auth } from './firebase-config';
import ImageViewHandler from "./components/imageViewHandler";

function App() {
  const history = useHistory();
  const { loader, error_msg, success_msg, login_loader } = useSelector((state) => state.main);
  const { admin, isAuthenticated } = useSelector((state) => state.auth);
  const [wait, setWait] = useState(true);
  const dispatch = useDispatch()

  const checkIsLogined = async () => {
    var token = getAuthentication();
    if (token) {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      axios.get(`${process.env.REACT_APP_API_URI}/accounts/fetchprofile/`, config).then(response => {
        const profileData = response.data;
        console.log("profileData")
        console.log(profileData)
        dispatch(loginNow({ token, tokenData: profileData }))
        setWait(false)
        getAllData(token);
      }).catch(err => {
        setWait(false)
        console.log(err)
      })

    } else {
      setWait(false)
    }
  }

  const getSubjects = (token) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    axios.get(`${process.env.REACT_APP_API_URI}exams/subject/`, config).then(response => {
      const subjectsData = response.data;
      console.log("subjectsData")
      console.log(subjectsData)
      dispatch(setSubjects(subjectsData))
    }).catch(err => {
      console.log(err)
    })

  }

  const getClasses = (token) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    axios.get(`${process.env.REACT_APP_API_URI}exams/class/`, config).then(response => {
      const classesData = response.data;
      console.log(classesData)
      dispatch(setClasses(classesData))
    }).catch(err => {
      console.log(err)
    })

  }

  const getTotalTest = () => {
    const totalTestData = [
      {
        _id: "1",
        subject: "maths",
        totalTest: 0,
        totalAccessed: 0,
      },
      {
        _id: "2",
        subject: "science",
        totalTest: 0,
        totalAccessed: 0,
      },
      {
        _id: "3",
        subject: "hindi",
        totalTest: 0,
        totalAccessed: 0,
      },
      {
        _id: "4",
        subject: "c++",
        totalTest: 0,
        totalAccessed: 0,
      },
    ]
    dispatch(setTotalTest(totalTestData))
  }

  const getWallet = () => {
    const walletData = {
      score: 0,
      points: 0,
    }
    dispatch(setWalletData(walletData))
  }

  const getAllData = (token) => {
    getSubjects(token);
    getClasses(token);
    getTotalTest(token);
    getWallet(token);
  }

  useEffect(() => {
    checkIsLogined();
  }, [])

  return (
    <>
      {/* {loader && <Loader />} */}
      {
        !wait ?
          <Router>
            <ToastHandler2 />
            <ImageViewHandler />
            <Switch>
              <Route exact path="/" component={Home} />

              {/* internal_teacher */}
              <Route exact path="/internal_teacher_login" component={InternalTeacherLogin} />
              <Route exact path="/internal_teacher_signup" component={InternalTeacherSignUp} />
              <PrivateRoute exact path="/in/" component={InternalTeacherDashboard} />
              <PrivateRoute exact path="/in/dashboard" component={InternalTeacherDashboard} />
              <PrivateRoute exact path="/in/topics" component={TopicManage} />
              <PrivateRoute exact path="/in/topic_add" component={CreateTopic} />
              <PrivateRoute exact path="/in/update_topic/:id" component={CreateTopic} />
              <PrivateRoute exact path="/in/chapters" component={ChapterManage} />
              <PrivateRoute exact path="/in/chapter_add" component={CreateChapter} />
              <PrivateRoute exact path="/in/maintopics" component={MainTopic} />
              <PrivateRoute exact path="/in/maintopics_add" component={CreateMainTopic} />
              <PrivateRoute exact path="/in/add_test" component={SelectTopic} />
              <PrivateRoute exact path="/in/add_test_que/:topicId" component={QuestionsManager} />
              <Route exact path="/guest/preview/:id" component={Preview} />


              {/* student */}
              <Route exact path="/student_login" component={StudentLogin} />
              <Route exact path="/student_signup" component={StudentSignUp} />
              <PrivateRoute exact path="/student" component={StudentDashboard} />
              <PrivateRoute exact path="/student/dashboard" component={StudentDashboard} />
              <PrivateRoute exact path="/student/start" component={GetTest} />
              <PrivateRoute exact path="/student/start/:topicId" component={StartTest} />
              <PrivateRoute exact path="/student/questions/:topicId" component={Questions} />
              <PrivateRoute exact path="/student/old_test_results" component={OldTestResults} />
              <PrivateRoute exact path="/student/old_test_results_preview/:examId" component={OldQuestions} />

            </Switch>
          </Router> :
          <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <center><div class="spinner-border text-dark" role="status">
              <span class="sr-only">Loading...</span>
            </div></center>
          </div>
      }

    </>
  );
}

export default App;
