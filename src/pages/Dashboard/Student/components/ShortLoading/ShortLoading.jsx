import React from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./ShortLoading.css";


function ShortLoading() {
    return (
        <div className="shortLoading">
            <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="" />
        </div>
    );
}

export default ShortLoading;
