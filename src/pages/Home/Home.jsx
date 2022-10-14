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
    if (admin.data.is_student) {
      history.push("/student/")
    }
    if (admin.data.is_internalteacher) {
      history.push("/in/")
    }
  }

  return (
    <div id="mainWrapper" className="container-fluid">
      {/* login main model */}
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src="/assets/images/logo.png" className="logoImg" />
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
              </button>
              <button><Link to="">Tutor Login</Link></button>
              <button data-toggle="modal" data-target="#exampleModal"><Link>Guest Login</Link></button>
              <button>
                <a href="/internal_teacher_login">
                  Internal Teacher Login
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* signup model */}
      <div class="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src="/assets/images/logo.png" className="logoImg" />
                <h1>CelatomUniverse</h1>
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="loginBtns">
              <button>
                <a href="/student_signup">
                  Student Sign Up
                </a>
              </button>
              <button><Link to="">Tutor Sign Up</Link></button>
              <button data-toggle="modal" data-target="#exampleModal2"><Link>Guest Sign Up</Link></button>
              <button>
                <a href="/internal_teacher_signup">
                  Internal Teacher Sign Up
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* login main model end */}
      <nav>
        <div className="left">
          <img src="/assets/images/logo.png" className="logoImg" />
          <h1>CelatomUniverse</h1>
        </div>
        {
          !isAuthenticated ?
            <>
              <span>
                <button type="button" data-toggle="modal" data-target="#exampleModal2" className="m-2">SIGN UP</button>
                <button type="button" data-toggle="modal" data-target="#exampleModal" className="m-2">LOGIN</button>
              </span>
            </> :
            <span className="goToDashboardBtn" onClick={goToDashboard}>Go to Dashboard</span>
        }

      </nav>
      <header>
        <div className="left">
          <h4>Start Your Test With Just ₹20* Only</h4>
          <p>No Monthly Plan, No Yearly Plan, Learn What You Want.</p>
          <b>Give any 2 Tests of your choice on Sign Up.</b>
          <button>Sign Up</button>
          <h1>Getting You Where You Want to Study</h1>
        </div>
        <div className="right">
          <div>
            <img src={require("./h2.png")} alt="" />
            <img src={require("./h1.png")} alt="" />
          </div>
          <div>
            <img src={require("./arrow-right.png")} alt="" />
            <button>Take a Free Test</button>
          </div>
        </div>
      </header>
      <hr />
      <section>
        <div className="left">
          <h1>Opportunity For Tutors Coming Soon</h1>
          <div>
            <p>Let us Know If You Are Interested</p>
            <button>Register Yourself</button>
          </div>
        </div>
        <div className="right">
          <div>
            <img src={require("./arrow-right.png")} alt="" />
            <button>Make a Test</button>
          </div>
        </div>
      </section>
      <hr />
      <header className="b">
        <div className="top">
          <h2>Make Your Offline/Online Institute Digital With Us.</h2>
          <p>At Minimal Cost and Without Giving Your Student Identity.</p>
        </div>
        <div className="bottom">
          <div className="left">
            <p>For detailed process, click on this</p>
            <button>Know More</button>
          </div>
          <div className="right">
            <button>Sign Up as Tutor</button>
          </div>
        </div>
      </header>
      <hr />
      <div className="subBoxContainer">
        <div className="subBox">
          <img src={require("./images/a1.png")} alt="" />
          <span>Reports</span>
        </div>
        <div className="subBox">
          <img src={require("./images/a2.png")} alt="" />
          <span>Ranking</span>
        </div>
        <div className="subBox">
          <img src={require("./images/a3.png")} alt="" />
          <span>Doubt Solving</span>
        </div>
        <div className="subBox">
          <img src={require("./images/a4.png")} alt="" />
          <span>Career Support</span>
        </div>
      </div>
      <hr />
      <div className="subBoxContainer b">
        <div className="subBox five">
          <img src={require("./images/a5.png")} alt="" />
          <img src={require("./images/a51.png")} alt="" />
          <span>Reports</span>
        </div>
        <div className="subBox">
          <img src={require("./images/a6.png")} alt="" />
          <span>Ranking</span>
        </div>
        <div className="subBox">
          <img src={require("./images/a7.png")} alt="" />
          <span>Doubt Solving</span>
        </div>
        <div className="subBox eight">
          <img src={require("./images/a8.png")} alt="" />
          <img src={require("./images/a81.png")} alt="" />
          <span>Career Support</span>
        </div>
      </div>
      <hr />
      <div className="exploreContainer">
        <h2>Explore Our Online Subjects</h2>
        <div className="bottom">
          <div className="subBox">
            <img src={require("./images/s1.png")} alt="" />
            <span>Science</span>
            <p>20+ Test Available</p>
          </div>
          <div className="subBox">
            <img src={require("./images/s2.png")} alt="" />
            <span>Mathematics</span>
            <p>20+ Test Available</p>
          </div>
          <div className="subBox">
            <img src={require("./images/s3.png")} alt="" />
            <span>Social Science</span>
            <p>20+ Test Available</p>
          </div>
          <div className="subBox">
            <img src={require("./images/s4.png")} alt="" />
            <span>English</span>
            <p>20+ Test Available</p>
          </div>
          <div className="subBox">
            <img src={require("./images/s5.png")} alt="" />
            <span>Hindi/Punjabi</span>
            <p>20+ Test Available</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="subBoxContainer b loginDiv">
        <div className="subBox">
          <div className="t">For Students</div>
          <img src={require("./images/l1.png")} alt="" />
          <span>Topic wise tests for practice</span>
          <span>Only ₹20 per test</span>
          <span>Innovative and creative methods</span>
          <button>Sign Up</button>
        </div>
        <div className="subBox">
          <div className="t">For Tutors</div>
          <img src={require("./images/l2.png")} alt="" />
          <span>Make your institution digital</span>
          <span>Minimal cost maximum benefits</span>
          <span>Get the best with CelatomUniverse</span>
          <button>Sign Up</button>
        </div>
        <div className="subBox">
          <div className="t">For Internal Teachers</div>
          <img src={require("./images/l3.png")} alt="" />
          <span>Create test and get paid</span>
          <span>Variety of topics</span>
          <span>Ease of accesibilty</span>
          <button>Sign Up</button>
        </div>
      </div>
      <hr />
      <div className="swiperBox">
        <div className="box1"></div>
        <div className="box2"></div>
        <center>
          <h3>What our Teachers and Students say about us? </h3>
        </center>
        <br />
        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div className="row">
                <div className="left">
                  <img src={"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"} alt="" className="avatar" />
                  <p>Shubham kumar 1</p>
                  <span>Student</span>
                </div>
                <div className="right">
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reiciendis quo assumenda minus. Debitis deserunt ab perspiciatis soluta aspernatur nemo ut, sunt, commodi optio ad minus. Officia reiciendis eveniet doloribus aliquam eligendi ipsam laudantium temporibus ad voluptatibus alias modi magni voluptatem voluptate odit, beatae deleniti quis ab quia natus unde!</p>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div className="row">
                <div className="left">
                  <img src={"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"} alt="" className="avatar" />
                  <p>Shubham kumar 2</p>
                  <span>Student</span>
                </div>
                <div className="right">
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reiciendis quo assumenda minus. Debitis deserunt ab perspiciatis soluta aspernatur nemo ut, sunt, commodi optio ad minus. Officia reiciendis eveniet doloribus aliquam eligendi ipsam laudantium temporibus ad voluptatibus alias modi magni voluptatem voluptate odit, beatae deleniti quis ab quia natus unde!</p>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div className="row">
                <div className="left">
                  <img src={"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"} alt="" className="avatar" />
                  <p>Shubham kumar 3</p>
                  <span>Student</span>
                </div>
                <div className="right">
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam reiciendis quo assumenda minus. Debitis deserunt ab perspiciatis soluta aspernatur nemo ut, sunt, commodi optio ad minus. Officia reiciendis eveniet doloribus aliquam eligendi ipsam laudantium temporibus ad voluptatibus alias modi magni voluptatem voluptate odit, beatae deleniti quis ab quia natus unde!</p>
                </div>
              </div>
            </div>

          </div>
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
      <hr />
      <footer>
        <div className="left">
          <div className="row2">
            <img src="/assets/images/logo.png" alt="" />
            <span>Celetom Universe</span>
          </div>
          <p>Celatom Universe is an educational platform that offers professional courses, test series. The platform offers paid and free trials for Celatom Universe users, offers courses in 3 languages, and focuses on helping individuals invest in their professional development.</p>
        </div>
        <div className="right">
          <h1>Quick Links</h1>
          <p>@celetom.universe24</p>
          <p>celatom2412universe@gmail.com</p>
        </div>
      </footer>
    </div >
  );
}

export default Home;
