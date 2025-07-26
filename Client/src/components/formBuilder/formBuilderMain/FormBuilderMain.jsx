import { useState, useEffect } from "react";
import "./formBuilderMainStyle.css";
import { useSelector } from "react-redux";
import AddQuestionBtn from "../sidebarRight/actionButtons/addQuestionBtn/AddQuestionBtn";

const FormBuilderMain = () => {
  const { ui } = useSelector((state) => state.uiSlice);
  const rgba = ui?.backgroundColor;

  

  return (
    <div
      className="formBuilder-main-content-body"
      style={{ backgroundColor: rgba }}
    >
      <AddQuestionBtn/>
    </div>
  );
};

export default FormBuilderMain;
