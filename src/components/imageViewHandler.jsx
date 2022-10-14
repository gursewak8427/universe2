import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMsg, setGlobalImage, setSuccessMsg } from "../services/actions/mainAction";
import './imageViewHandler.css'

const ImageViewHandler = () => {
  const dispatch = useDispatch();
  const { globalImage } = useSelector((state) => state.main);
  const [image, setImage] = useState("")

  useEffect(() => {
    setImage(globalImage)
  }, [globalImage])

  return <>
    {
      globalImage != "" ?
        <div id="imageViewWrapper">
          <i className="fa fa-times" onClick={() => dispatch(setGlobalImage(""))}></i>
          <img src={globalImage} alt="" />
        </div> : <></>
    }
  </>
}

export default ImageViewHandler;