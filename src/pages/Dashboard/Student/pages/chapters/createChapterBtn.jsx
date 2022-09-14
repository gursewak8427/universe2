import React from "react";

import { Link } from "react-router-dom";


function CreateChapterBtn() {

  return (
    <Link
      to="/in/chapter_add" className="add_driver_link">
      <div className="add_product_btn">Add</div>
    </Link>
  );
}

export default CreateChapterBtn;