import ShortAnswer from "../../../questionType/ShortAnswer";
import LongAnswer from "../../../questionType/LongAnswer";
import MultipleChoice from "../../../questionType/multipleChoice/MultipleChoice";
import CheckBox from "../../../questionType/checkBox/CheckBox";
import Date from "../../../questionType/Date";
import LinearScale from "../../../questionType/linearScale/LinearScale";
import Rating from "../../../questionType/rating/Rating";
import Dropdown from "../../../questionType/dropdown/Dropdown";
import FileUpload from "../../../questionType/fileUpload/FileUpload";
import { useState, useEffect } from "react";


const AddQuestionBtn = () => {
    const [isClickedSelectQuestionType, setIsClickedSelectQuestionType] =
    useState(false);
  const [questionType, setQuestionType] = useState("multipleChoice");

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
  document
    .querySelector("#quesTextArea")
    ?.addEventListener("input", autoResize);

  useEffect(() => {
    if (questionType === "shortAnswer" || questionType === "longAnswer") {
      document
        .querySelector("#shortAnswerTextarea")
        ?.addEventListener("input", autoResize);
      document
        .querySelector("#longAnswerTextarea")
        ?.addEventListener("input", autoResize);
    }
  }, [questionType]);

  const questionTypeArray = [
    {
      text: "Short Answer",
      id: "shortAnswer",
    },
    {
      text: "Long Answer",
      id: "longAnswer",
    },
    {
      text: "Multiple Choice",
      id: "multipleChoice",
    },
    {
      text: "Checkbox",
      id: "checkbox",
    },
    {
      text: "Dropdown",
      id: "dropdown",
    },
    {
      text: "File Upload",
      id: "fileUpload",
    },
    {
      text: "Date",
      id: "date",
    },
    {
      text: "Linear Scale",
      id: "linearScale",
    },
    {
      text: "Rating",
      id: "rating",
    },
  ];
  return (
    <div className="formBuilder-question-container">
        <div className="formBuilder-questions-section">
          <div className="formBuilder-question">
            <div>
              <span className="question-number">Q1</span>
              <textarea
                name="question"
                id="quesTextArea"
                placeholder="What is?"
                rows={1}
              ></textarea>
            </div>

            <div className="select-question-type-container">
              <img
                src={`/svgs/${questionType}.svg`}
                alt=""
                className="select-question-type"
                onClick={() =>
                  setIsClickedSelectQuestionType(!isClickedSelectQuestionType)
                }
              />

              {isClickedSelectQuestionType && (
                <ul className="option-question-type">
                  {questionTypeArray.map((type, index) => (
                    <li
                      key={index}
                      id={type.id}
                      onClick={(e) => (
                        setQuestionType(e.target.id),
                        setIsClickedSelectQuestionType(
                          !isClickedSelectQuestionType
                        )
                      )}
                    >
                      {type.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="formBuilder-answer">
            {questionType === "shortAnswer" && (
             <ShortAnswer/>
            )}
            {questionType === "longAnswer" && (
              <LongAnswer/>
            )}
            {questionType === "multipleChoice" && (
              <MultipleChoice/>
            )}
            {questionType === "checkbox" && (
              <CheckBox/>
            )}
            {questionType === "date" && (
              <Date/>
            )}
            {questionType === "linearScale" && (
              <LinearScale/>
            )}
            {questionType === "rating" && (
              <Rating/>
            )}
            {questionType === "dropdown" && (
              <Dropdown/>
            )}
            {questionType === "fileUpload" && (
              <FileUpload/>
            )}
          </div>
        </div>
      </div>
  )
}

export default AddQuestionBtn
