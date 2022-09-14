import React, { useEffect, useState } from "react";
import { useStyles } from "../../../utils/useStyles";
import axios from "axios";
import Sidebar from "./components/Sidebar/Sidebar";
import './dashboard.css'

import { Splide, SplideSlide } from '@splidejs/react-splide';

// Default theme
import '@splidejs/splide/dist/css/themes/splide-default.min.css';


function InternalTeacherDashboard() {
    const classes = useStyles();
    const [isWait, setWait] = useState(false);
    const [isWait1, setWait1] = useState(false);
    const [isWait2, setWait2] = useState(false);
    const [isWait3, setWait3] = useState(false);
    const [totalCustomers, setTotalCustomers] = useState(0)
    const [totalReqServices, setTotalReqServices] = useState(0)
    const [totalBookings, setTotalBookings] = useState(0)
    const [totalServiceProviders, setTotalServiceProviders] = useState(0)



    return (
        <div className={classes.root}>
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.toolbar} />

                {/* box 1 */}
                <div className="top-row">
                    <FirstBox />
                    <SecondBox />
                </div>
                <div className="bottom-row">
                    <ThirdBox />
                    <FourthBox />
                </div>

            </main>
        </div>
    );
}

const SS = () => {
    return (
        <Splide aria-label="My Favorite Images">
            <SplideSlide>
                <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=486" alt="Image 1" />
            </SplideSlide>
            <SplideSlide>
                <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=486" alt="Image 2" />
            </SplideSlide>
        </Splide>
    )
}


const FirstBox = () => {
    return (
        <>
            <div className="col-6 col-xl-5 main-box">
                <h1>Hi Kamaldeep,</h1>
                <h1>Good Morning!</h1>
                <div className="m-row jc-sb mb-3 recomended_row">
                    <span>
                        Recommended Tests
                    </span>
                    <span className="m-row col-1 d-flex jc-sb">
                        <i className="fa-solid fa-angle-left"></i>
                        <i className="fa-solid fa-angle-right"></i>
                    </span>
                </div>
                <div className="test-list">
                    <div className="test">
                        <div className="top">
                            <div className="left">
                                <img src={require("./business_study1.png")} />
                            </div>
                            <div className="right">
                                <img src={require("./business_study2.png")} />
                            </div>
                        </div>
                        <h2>Business Studies</h2>
                        <div className="dtl">
                            <div className="dt">
                                <p>Student</p>
                                <span>
                                    <div className="smallImg">
                                        <img src={require("./u1.png")} alt="" />
                                    </div>
                                    <div className="smallImg">
                                        <img src={require("./u2.png")} alt="" />
                                    </div>
                                    <div className="smallImg">
                                        <img src={require("./u3.png")} alt="" />
                                    </div>
                                    <div className="smallImg">+6</div>
                                </span>
                            </div>
                            <div className="dt">
                                <p>Topics</p>
                                <span>
                                    <h6>18</h6>
                                </span>
                            </div>
                            <div className="dt">
                                <p>Total Hour</p>
                                <span>
                                    <h6>13 hr</h6>
                                </span>
                            </div>
                        </div>
                        <div className="btnn"><button>Start Test</button></div>
                    </div>
                    <div className="test">
                        <div className="top">
                            <div className="left">
                                <img src={require("./ac_1.png")} />
                            </div>
                            <div className="right">
                                <img src={require("./ac_2.png")} />
                            </div>
                        </div>
                        <h2>Accounts</h2>
                        <div className="dtl m-row align-stretch jc-sb">
                            <div className="dt">
                                <p>Student</p>
                                <span>
                                    <div className="smallImg">
                                        <img src={require("./u1.png")} alt="" />
                                    </div>
                                    <div className="smallImg">
                                        <img src={require("./u2.png")} alt="" />
                                    </div>
                                    <div className="smallImg">
                                        <img src={require("./u3.png")} alt="" />
                                    </div>
                                    <div className="smallImg">+4</div>
                                </span>
                            </div>
                            <div className="dt">
                                <p>Topics</p>
                                <span>
                                    <h6>22</h6>
                                </span>
                            </div>
                            <div className="dt">
                                <p>Total Hour</p>
                                <span>
                                    <h6>14 hr</h6>
                                </span>
                            </div>
                        </div>
                        <div className="btnn"><button>Start Test</button></div>
                    </div>
                </div>
            </div>
        </>
    );
}


const SecondBox = () => {
    return (
        <>
            <div className="col-4 col-xl-5 main-box reviews">
                <h1>Student Reviews</h1>
                <div className="m-row jc-sb mb-3 recomended_row">
                    <span>
                        <big>4.8</big><small>/5.0</small>
                        <div className="stars">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <span>45 Reviews</span>
                    </span>
                    <span className="m-row col-1 d-flex jc-sb">
                        {/* <i className="fa-solid fa-angle-left"></i>
                        <i className="fa-solid fa-angle-right"></i> */}
                    </span>
                </div>
                <div className="test-list reviews">
                    <Splide aria-label="My Favorite Images" options={{
                        perPage: 1,
                        gap: '1rem'
                    }}
                    >
                        <SplideSlide>
                            <div className="test">
                                <div className="top">
                                    <div className="left">
                                        14 July 2022
                                    </div>
                                    <div className="right">
                                        <img src={require("./qommas.png")} />
                                    </div>
                                </div>
                                <h2>What an Amazing Test </h2>
                                <p>“Thank you very much because it helped me alot to understand the subject.”</p>
                                <div className="foot">
                                    <div className="left">
                                        <img src={require("./usr.png")} alt="" className="UsrImg" />
                                        <div>
                                            <h6>Gursewak</h6>
                                            <p>Math Student</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <i className="fa-solid fa-star"></i>
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="test">
                                <div className="top">
                                    <div className="left">
                                        14 July 2022
                                    </div>
                                    <div className="right">
                                        <img src={require("./qommas.png")} />
                                    </div>
                                </div>
                                <h2>What an Amazing Test </h2>
                                <p>“Thank you very much because it helped me alot to understand the subject.”</p>
                                <div className="foot">
                                    <div className="left">
                                        <img src={require("./usr.png")} alt="" className="UsrImg" />
                                        <div>
                                            <h6>Gursewak</h6>
                                            <p>Math Student</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <i className="fa-solid fa-star"></i>
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="test">
                                <div className="top">
                                    <div className="left">
                                        14 July 2022
                                    </div>
                                    <div className="right">
                                        <img src={require("./qommas.png")} />
                                    </div>
                                </div>
                                <h2>What an Amazing Test </h2>
                                <p>“Thank you very much because it helped me alot to understand the subject.”</p>
                                <div className="foot">
                                    <div className="left">
                                        <img src={require("./usr.png")} alt="" className="UsrImg" />
                                        <div>
                                            <h6>Gursewak</h6>
                                            <p>Math Student</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <i className="fa-solid fa-star"></i>
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div className="test">
                                <div className="top">
                                    <div className="left">
                                        14 July 2022
                                    </div>
                                    <div className="right">
                                        <img src={require("./qommas.png")} />
                                    </div>
                                </div>
                                <h2>What an Amazing Test </h2>
                                <p>“Thank you very much because it helped me alot to understand the subject.”</p>
                                <div className="foot">
                                    <div className="left">
                                        <img src={require("./usr.png")} alt="" className="UsrImg" />
                                        <div>
                                            <h6>Gursewak</h6>
                                            <p>Math Student</p>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <i className="fa-solid fa-star"></i>
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                    </Splide>
                </div>
            </div>
        </>
    );
}


const ThirdBox = () => {
    return (
        <>
            <div className="col-5 col-xl-5 main-box reviews">
                <h1 className="ranking_top">
                    <span>Best Test Maker of The Week</span>
                    <img src={require("./board.png")} alt="" />
                </h1>
                <div className="box-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Ranking</th>
                                <th>Teacher Name</th>
                                <th>Subject</th>
                                <th>Student</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01</td>
                                <td>Gursewak</td>
                                <td>Maths</td>
                                <td>35(+3)</td>
                                <td>720 <span className="text-warning">(+40)</span> </td>
                            </tr>
                            <tr>
                                <td>01</td>
                                <td>Gursewak</td>
                                <td>Maths</td>
                                <td>35(+3)</td>
                                <td>720 <span className="text-warning">(+40)</span> </td>
                            </tr>
                            <tr>
                                <td>01</td>
                                <td>Gursewak</td>
                                <td>Maths</td>
                                <td>35(+3)</td>
                                <td>720 <span className="text-warning">(+40)</span> </td>
                            </tr>
                            <tr>
                                <td>01</td>
                                <td>Gursewak</td>
                                <td>Maths</td>
                                <td>35(+3)</td>
                                <td>720 <span className="text-warning">(+40)</span> </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="box-footer">
                    <div className="left">
                        <div className="content">
                            <h2>Congratulations !</h2>
                            <h5>Kamaldeep....</h5>
                            <p>You got First Position in this week for making awesome tests for students</p>
                        </div>
                        <div className="box a"></div>
                        <div className="box b"></div>
                    </div>
                    <div className="right">
                        <img src={require("./ranking_right.png")} alt="right-image" />
                    </div>
                </div>
            </div>
        </>
    );
}

const FourthBox = () => {
    return (
        <>
            <div className="comment_box col-5">
                <p>
                    <div className="circle">
                        <img src={require("./qomma_left.png")} alt="" />
                    </div>
                    <span>Education is not  the learning of facts, but the training of mind to think.</span>
                    <img src={require("./qomma_right.png")} alt="" />
                </p>
                <img src={require("./student_laptop_study.png")} alt="" />
            </div>
        </>
    )
}

export default InternalTeacherDashboard;
