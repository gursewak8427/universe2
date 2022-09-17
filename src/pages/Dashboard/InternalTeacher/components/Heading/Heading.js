import React from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import CreateChapterBtn from "../../pages/chapters/createChapterBtn";
import CreateMainTopicBtn from "../../pages/mainTopics/createMainTopicBtn";
import CreateTopicBtn from "../../pages/topics/createTopicBtn";
import "./Heading.css";


function Heading({ addMainTopicBtn, auditTab, report, addTopicBtn, addChapterBtn, createEventBtn, createfaqButton, headingTitle }) {
  const [heading, setHeading] = React.useState("");

  React.useEffect(() => {
    setHeading(
      headingTitle
    );
  }, [headingTitle]);

  let Boolean = (report && report) || (auditTab && auditTab);

  return (
    <Row>
      <Col>
        <h3 className="heading_top">{heading && heading}</h3>
      </Col>

      <Col>

        {
          addTopicBtn &&
          <CreateTopicBtn />
        }
        {
          addMainTopicBtn &&
          <CreateMainTopicBtn />
        }
        {
          addChapterBtn &&
          <CreateChapterBtn />
        }



      </Col>
    </Row >
  );
}

export default Heading;
