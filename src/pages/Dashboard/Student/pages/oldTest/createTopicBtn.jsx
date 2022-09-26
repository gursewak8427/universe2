import React from "react";

import { Link } from "react-router-dom";


function CreateTopicBtn() {

  return (
    <Link
      to="/in/topic_add" className="add_driver_link">
      <div className="add_product_btn">Add</div>
    </Link>
  );
}

export default CreateTopicBtn;