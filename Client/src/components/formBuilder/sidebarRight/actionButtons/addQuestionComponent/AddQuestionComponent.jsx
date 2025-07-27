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
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";

const AddQuestionComponent = ({ question }) => {
  const { qId, qno, type, text, options } = question;

  const { questions } = useSelector((state) => state.questionsSlice);
  // const { ui } = useSelector((state) => state.uiSlice);

  const [isClickedSelectQuestionType, setIsClickedSelectQuestionType] =
    useState(false);
  const [questionType, setQuestionType] = useState(type);

  const dispatch = useDispatch();

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  useEffect(() => {
    if (
      questionType === "shortAnswer" ||
      questionType === "longAnswer" ||
      questionType === "multipleChoice" ||
      questionType === "checkbox" ||
      questionType === "quesTextArea"
    ) {
      document
        .querySelector("#shortAnswerTextarea")
        ?.addEventListener("input", autoResize);
      document
        .querySelector("#longAnswerTextarea")
        ?.addEventListener("input", autoResize);
      document
        .querySelector("#multipleChoice")
        ?.addEventListener("input", autoResize);
      document
        .querySelector("#checkbox")
        ?.addEventListener("input", autoResize);
      document
        .querySelector("#quesTextArea")
        ?.addEventListener("input", autoResize);
    }
  }, [questionType]);

  //deleting questions when empty and backspace is pressed
  const handleKeyDown = (e) => {
    const question = questions.find((q) => q.qId === qId);
    if (!question) return;
    console.log(question)
    
    const isEmpty = question.text.trim() === "";

    if (e.key === "Backspace" && isEmpty) {
      e.preventDefault();
      const updated = questions.filter((q) => q.qId !== qId);
      dispatch(setQuestions(updated));
    }

    // Allow Enter default behavior only for shift+enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

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
    <div
      className="formBuilder-question-container"
      style={{ marginBottom: "50px", padding: "40px 20px" }}
    >
      <div className="formBuilder-questions-section">
        <div className="formBuilder-question">
          <div>
            <span className="question-number">Q{qno}</span>
            <textarea
              name="question"
              id="quesTextArea"
              placeholder="What is?"
              rows={1}
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => {
                const updatedQuestion = questions.map((question, index) =>
                  question.qId === qId
                    ? { ...question, text: e.target.value }
                    : question
                );

                dispatch(setQuestions(updatedQuestion));
              }}
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

            {/*----------------------------------------select question type dropdown-------------------------------- */}

            {isClickedSelectQuestionType && (
              <ul className="option-question-type">
                {questionTypeArray.map((type, index) => (
                  <li
                    key={index}
                    id={type.id}
                    onClick={(e) => {
                      setQuestionType(e.target.id);
                      setIsClickedSelectQuestionType(
                        !isClickedSelectQuestionType
                      );
                      const updatedQuestion = questions.map((question, index) =>
                        question.qId === qId
                          ? {
                              ...question,
                              type: e.target.id,
                              text: "",
                              options: ["", ""],
                            }
                          : question
                      );

                      dispatch(setQuestions(updatedQuestion));
                    }}
                  >
                    {type.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="formBuilder-answer">
          {questionType === "shortAnswer" && <ShortAnswer id={qId} />}
          {questionType === "longAnswer" && <LongAnswer />}
          {questionType === "multipleChoice" && <MultipleChoice id={qId} />}
          {questionType === "checkbox" && <CheckBox id={qId} />}
          {questionType === "date" && <Date id={qId} />}
          {questionType === "linearScale" && <LinearScale id={qId} />}
          {questionType === "rating" && <Rating id={qId} />}
          {questionType === "dropdown" && <Dropdown id={qId} />}
          {questionType === "fileUpload" && <FileUpload id={qId} />}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionComponent;
