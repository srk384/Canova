import ShortAnswer from "../../../questionType/ShortAnswer";
import LongAnswer from "../../../questionType/LongAnswer";
import MultipleChoice from "../../../questionType/multipleChoice/MultipleChoice";
import CheckBox from "../../../questionType/checkBox/CheckBox";
import Date from "../../../questionType/Date";
import LinearScale from "../../../questionType/linearScale/LinearScale";
import Rating from "../../../questionType/rating/Rating";
import Dropdown from "../../../questionType/dropdown/Dropdown";
import FileUpload from "../../../questionType/fileUpload/FileUpload";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";

const AddQuestionComponent = ({ question, preview }) => {
  const { qId, elId, qno, type, text, options } = question;

  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);

  // const [isContainElements, setIsContainElements] = useState(false);

  // const preview = ui?.previewMode;
  const [isClickedSelectQuestionType, setIsClickedSelectQuestionType] =
    useState(false);
  const [questionType, setQuestionType] = useState(type);

  const dispatch = useDispatch();

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsClickedSelectQuestionType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsClickedSelectQuestionType]);

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

const reorderQuestions = (questions) => {
  const validTypes = [
    "shortAnswer",
    "longAnswer",
    "multipleChoice",
    "checkbox",
    "dropdown",
    "fileUpload",
    "date",
    "linearScale",
    "rating",
  ];

  // Group questions by pageId
  const pageGroups = {};

  questions.forEach((q) => {
    if (!q.pageId) return;
    if (!pageGroups[q.pageId]) {
      pageGroups[q.pageId] = [];
    }
    pageGroups[q.pageId].push(q);
  });

  // Reorder each page's questions
  const reorderedQuestions = [];

  Object.values(pageGroups).forEach((group) => {
    let order = 1;
    group.forEach((q) => {
      if (validTypes.includes(q.type)) {
        reorderedQuestions.push({
          ...q,
          questionOrder: order++,
        });
      } else {
        reorderedQuestions.push(q);
      }
    });
  });

  return reorderedQuestions;
};

  const reorderElements = (questions) => {
    const validTypes = [
      "shortAnswer",
      "longAnswer",
      "multipleChoice",
      "checkbox",
      "dropdown",
      "fileUpload",
      "date",
      "linearScale",
      "rating",
    ];

    let currentSectionId = null;
    let order = 1;

    return questions.map((question) => {
      // Reset order if this question belongs to a new section
      if (question.sectionId && question.sectionId !== currentSectionId) {
        currentSectionId = question.sectionId;
        order = 1; // Reset order for new section
      }

      // Update elements order if elements exist
      if (question.elements) {
        return {
          ...question,
          elements: question.elements.map((el) => {
            if (validTypes.includes(el.type)) {
              return { ...el, elementsOrder: order++ };
            }
            return el; // Keep invalid types unchanged
          }),
        };
      }

      return question;
    });
  };

  //deleting questions when empty and backspace is pressed
  const handleKeyDown = (e) => {
    let question = null;

    if (qId) {
      // Find question directly by qId
      question = questions.find((q) => q.qId === qId);
    } else if (elId) {
      // Find the question containing the element first
      const parentQuestion = questions.find((q) =>
        q.elements?.some((el) => el.elId === elId)
      );

      if (parentQuestion) {
        question = parentQuestion.elements.find((el) => el.elId === elId);
      }
    }

    if (!question) return;

    const isEmpty = question.text.trim() === "";

    if (e.key === "Backspace" && isEmpty && qId) {
      e.preventDefault();
      const updated = questions.filter((q) => q.qId !== qId);

      const reordered = reorderQuestions(updated);
      dispatch(setQuestions(reordered));
    }

    if (e.key === "Backspace" && isEmpty && elId) {
      e.preventDefault();
      const updated = questions.map((question) =>
        // Check if this question contains the element to delete
        question.elements?.some((el) => el.elId === elId)
          ? {
              ...question,
              elements: question.elements.filter((el) => el.elId !== elId),
            }
          : question
      );

      const reordered = reorderElements(updated);
      dispatch(setQuestions(reordered));
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
      style={{ padding: "30px 20px" }}
    >
      <div className="formBuilder-questions-section">
        <div className="formBuilder-question">
          <div className="textarea-container">
            <span className="question-number">Q{qno}</span>
            <textarea
              name="question"
              id="quesTextArea"
              placeholder="What is?"
              rows={1}
              disabled={ui.previewMode}
              value={text}
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => {
                if (qId) {
                  const updatedQuestion = questions.map((question, index) =>
                    question.qId === qId
                      ? { ...question, text: e.target.value }
                      : question
                  );

                  dispatch(setQuestions(updatedQuestion));
                } else if (elId) {
                  const updatedQuestion = questions.map((question) => {
                    // Check if this question contains the element to delete
                    if (question.elements?.some((el) => el.elId === elId)) {
                      return {
                        ...question,
                        elements: question.elements.map((el) =>
                          el.elId === elId
                            ? {
                                ...el,
                                text: e.target.value,
                              }
                            : el
                        ),
                      };
                    }
                    return question; // keep other questions as-is
                  });

                  dispatch(setQuestions(updatedQuestion));
                }
              }}
            ></textarea>
          </div>

          <div className="select-question-type-container">
            {!ui?.previewMode && (
              <img
                src={`/svgs/${questionType}.svg`}
                alt=""
                className="select-question-type"
                onClick={() =>
                  !preview &&
                  setIsClickedSelectQuestionType(!isClickedSelectQuestionType)
                }
              />
            )}

            {/*----------------------------------------select question type dropdown-------------------------------- */}

            {isClickedSelectQuestionType && (
              <ul ref={containerRef} className="option-question-type">
                {questionTypeArray.map((type, index) => (
                  <li
                    key={index}
                    id={type.id}
                    onClick={(e) => {
                      setQuestionType(e.target.id);
                      setIsClickedSelectQuestionType(
                        !isClickedSelectQuestionType
                      );
                      if (qId) {
                        const updatedQuestion = questions.map(
                          (question, index) =>
                            question.qId === qId
                              ? {
                                  ...question,
                                  type: e.target.id,
                                  // text: "",
                                  options: ["", ""],
                                }
                              : question
                        );

                        dispatch(setQuestions(updatedQuestion));
                      } else if (elId) {
                        const updatedQuestion = questions.map((question) => {
                          // Check if this question contains the element to delete
                          if (
                            question.elements?.some((el) => el.elId === elId)
                          ) {
                            return {
                              ...question,
                              elements: question.elements.map((el) =>
                                el.elId === elId
                                  ? {
                                      ...el,
                                      type: e.target.id,
                                    }
                                  : el
                              ),
                            };
                          }
                          return question; // keep other questions as-is
                        });

                        dispatch(setQuestions(updatedQuestion));
                      }
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
          {questionType === "shortAnswer" && (
            <ShortAnswer question={question} />
          )}
          {questionType === "longAnswer" && <LongAnswer question={question} />}
          {questionType === "multipleChoice" && (
            <MultipleChoice question={question} />
          )}
          {questionType === "checkbox" && <CheckBox question={question} />}
          {questionType === "date" && <Date question={question} />}
          {questionType === "linearScale" && (
            <LinearScale question={question} />
          )}
          {questionType === "rating" && <Rating question={question} />}
          {questionType === "dropdown" && <Dropdown question={question} />}
          {questionType === "fileUpload" && <FileUpload question={question} />}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionComponent;
