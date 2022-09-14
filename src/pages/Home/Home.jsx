import React, { useEffect, useState } from "react";
import { useStyles } from "../../utils/useStyles";
import axios from "axios";
import "./home.css";
import { Link, useHistory } from "react-router-dom";
import InternalTeacherLogin from "./InternalTeacher/InternalTeacher";
import { useSelector } from "react-redux";

function Home() {
  const classes = useStyles();
  const history = useHistory();
  const { error_msg, success_msg } = useSelector((state) => state.main);
  const { isAuthenticated, admin } = useSelector((state) => state.auth);

  const goToDashboard = () => {
    // check login type
    if (admin.data.loginType == "INTERNAL_TEACHER") {
      history.push("/in/")
    }
    if (admin.data.loginType == "STUDENT") {
      history.push("/student/")
    }
  }

  return (
    <div id="mainWrapper" className="container">
      {/* login main model */}
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src={require("./Icon.svg")} className="logoImg" />
                <h1>CelatomUniverse</h1>
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="loginBtns">
              <button>
                <a href="/student_login">
                  Student Login
                </a>
                <Link to=""> Login</Link>
              </button>
              <button><Link to="">Tutor Login</Link></button>
              <button data-toggle="modal" data-target="#exampleModal2"><Link>Guest Login</Link></button>
              <button>
                <a href="/internal_teacher_login">
                  Internal Teacher Login
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* login main model end */}
      <nav>
        <div className="left">
          <img src={require("./Icon.svg")} className="logoImg" />
          <h1>CelatomUniverse</h1>
        </div>
        {
          !isAuthenticated ?
            <button type="button" data-toggle="modal" data-target="#exampleModal">Sign Up</button> :
            <span className="goToDashboardBtn" onClick={goToDashboard}>Go to Dashboard</span>
        }

      </nav>
      <header>

      </header>
    </div >
  );
}

export default Home;
