import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ErrorPage.css";
const ErrorPage = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="four_zero_four_bg">
              <h1 className="text-center ">404</h1>
            </div>

            <div className="content_box_404">
              <h3 className="h2">Look like you're lost</h3>

              <p>the page you are looking for not available!</p>
              <Button variant="success">
                <Link to="/login" className="text-white">
                  Go to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
