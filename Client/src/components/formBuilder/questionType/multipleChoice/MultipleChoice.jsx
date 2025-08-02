import { useState, useRef, useEffect } from "react";
import "./MultipleChoiceStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";
import { setConditions } from "../../../../utils/redux/slices/conditionsSlice";

const MultipleChoice = ({ question }) => {
  const { qId, elId, qno, type, text, pageId } = question;

  const [options, setOptions] = useState(["", ""]); // Start with 2 empty options
  const optionRefs = useRef([]);

  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);
  const { conditions } = useSelector((state) => state.conditions);

  useEffect(() => {
    if (qId) {
      questions.forEach(
        (question) =>
          question.qId === qId &&
          question.options &&
          setOptions(question.options)
      );
    } else if (elId) {
      questions.forEach((question) => {
        question.elements?.forEach((el) => {
          el.elId === elId && el.options && setOptions(el.options);
        });
      });
    }
  }, [questions]);

  const handleChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    // setOptions(updated);

    if (qId) {
      const updatedOptions = questions.map((question) =>
        question.qId === qId ? { ...question, options: updated } : question
      );
      dispatch(setQuestions(updatedOptions));
    } else if (elId) {
      const updatedOptions = questions.map((question) => {
        if (question.elements) {
          return {
            ...question,
            elements: question.elements.map((el) =>
              el.elId === elId ? { ...el, options: updated } : el
            ),
          };
        }
        return question;
      });

      dispatch(setQuestions(updatedOptions));
    }
  };

  const handleKeyDown = (e, index) => {
    const isEmpty = options[index].trim() === "";

    if (e.key === "Enter" && e.shiftKey) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const newOptions = [...options];
      newOptions.splice(index + 1, 0, ""); // Insert empty option
      setOptions(newOptions);

      setTimeout(() => {
        optionRefs.current[index + 1]?.focus();
      }, 0);
    }

    if (e.key === "Backspace" && isEmpty && options.length > 1) {
      e.preventDefault();

      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);

      setTimeout(() => {
        if (index > 0) {
          optionRefs.current[index - 1]?.focus();
        }
      }, 0);
    }
  };

  return (
    <div className="multiple-choice-container">
      {options.map((opt, i) => (
        <div className="option-condition-row" key={i}>
          <div className="option-row">
            <input
              type="radio"
              name={`option ${qId || elId}`}
              value={opt}
              className="hidden-radio"
              onClick={(e) => {
                if (qId) {
                  const userResp = questions.map((question) =>
                    question.qId === qId
                      ? {
                          ...question,
                          response: e.target.value,
                        }
                      : question
                  );
                  dispatch(setQuestions(userResp));
                } else if (elId) {
                  const userResp = questions.map((question) => {
                    if (question.elements) {
                      return {
                        ...question,
                        elements: question.elements.map((el) =>
                          el.elId === elId
                            ? {
                                ...el,
                                response: e.target.value,
                              }
                            : el
                        ),
                      };
                    }
                    return question;
                  });

                  dispatch(setQuestions(userResp));
                }
              }}
            />
            <span className="custom-radio"></span>
            <textarea
              ref={(el) => (optionRefs.current[i] = el)}
              className="option-input"
              disabled={ui?.previewMode}
              value={opt}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={`Option ${i + 1}`}
              rows={1}
              id="multipleChoice"
            />
          </div>

          {/*--------------------------------- add condition ------------------------------------*/}

          {ui.addCondition && (
            <div className="addcondition-radio">
              <input
                type="radio"
                name={`condition ${qId || elId}`}
                disabled={ui?.previewMode}
                value={opt}
                checked={
                  conditions.find(
                    (c) =>
                      c.questionId === (qId || elId) && c.trueAnswer === opt
                  ) !== undefined
                }
                className="hidden-condition-radio"
                onClick={() => {
                  const updatedConditions = Array.isArray(conditions)
                    ? [...conditions]
                    : []; // ensure array

                  const existingIndex = updatedConditions.findIndex(
                    (c) => c.questionId === (qId || elId)
                  );

                  if (existingIndex !== -1) {
                    // Overwrite the existing condition
                    updatedConditions[existingIndex] = {
                      ...updatedConditions[existingIndex],
                      trueAnswer: opt,
                    };
                  } else {
                    // Add a new condition if array is empty or doesn't have this question
                    updatedConditions.push({
                      questionId: qId || elId,
                      trueAnswer: opt,
                      pageId: pageId,
                    });
                  }

                  dispatch(setConditions(updatedConditions));
                }}
              />
              <span className="custom-condition-radio"></span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;
