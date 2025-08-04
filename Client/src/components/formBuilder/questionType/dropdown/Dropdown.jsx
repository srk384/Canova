import "./DropdownStyle.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";
import { setConditions } from "../../../../utils/redux/slices/conditionsSlice";

const Dropdown = ({ question }) => {
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
    <div className="dropdown-container">
      {!ui.previewMode &&
        options.map((opt, i) => (
          <div className="option-condition-row" key={i}>
            <div className="option-row">
              <input
                ref={(el) => (optionRefs.current[i] = el)}
                className="dropdown-option-input"
                value={opt}
                // disabled={ui?.previewMode}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                placeholder={`Drop Down Option ${i + 1}`}
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
                  conditions.some(
                    (c) =>
                      c.questionId === (qId || elId) && c.trueAnswer === opt
                  ) ||
                  (!conditions.some((c) => c.questionId === (qId || elId)) &&
                    question.conditions?.questionId === (qId || elId) &&
                    question.conditions?.trueAnswer === opt)
                }
                className="hidden-condition-radio"
                onClick={() => {
                  const selectedId = qId || elId;

                  const reduxIndex = conditions.findIndex(
                    (c) => c.questionId === selectedId && c.trueAnswer === opt
                  );

                  const backendSelected =
                    question.conditions &&
                    question.conditions.questionId === selectedId &&
                    question.conditions.trueAnswer === opt;

                  let updatedConditions = [...conditions];

                  // Clone and update questions array
                  const updatedQuestions = questions.map((q) => {
                    if (
                      q.qId === qId ||
                      q.elements?.some((el) => el.elId === elId)
                    ) {
                      // Target question found
                      if (reduxIndex !== -1 || backendSelected) {
                        // Remove condition
                        return {
                          ...q,
                          conditions: null,
                        };
                      } else {
                        // Add or update condition
                        return {
                          ...q,
                          conditions: {
                            questionId: selectedId,
                            trueAnswer: opt,
                            pageId,
                          },
                        };
                      }
                    }
                    return q;
                  });

                  if (reduxIndex !== -1) {
                    // Toggle off: remove from conditions array
                    updatedConditions.splice(reduxIndex, 1);
                  } else if (backendSelected) {
                    // Backend-selected option → treat as toggled off → add empty override
                    // Optional: Skip this if you’re updating `questions` array directly
                    updatedConditions = updatedConditions.filter(
                      (c) => c.questionId !== selectedId
                    );
                  } else {
                    // Add/update condition in Redux
                    const existingIndex = updatedConditions.findIndex(
                      (c) => c.questionId === selectedId
                    );
                    const newCondition = {
                      questionId: selectedId,
                      trueAnswer: opt,
                      pageId,
                    };

                    if (existingIndex !== -1) {
                      updatedConditions[existingIndex] = newCondition;
                    } else {
                      updatedConditions.push(newCondition);
                    }
                  }

                  dispatch(setConditions(updatedConditions));
                  dispatch(setQuestions(updatedQuestions));
                }}
                />
                <span className="custom-condition-radio"></span>
              </div>
            )}
          </div>
        ))}

      {ui.previewMode && (
        <div className="custom-dropdown-container">
          {(() => {
            const [selectedOption, setSelectedOption] =
              useState("Select an option");
            const [isOpen, setIsOpen] = useState(false);

            return (
              <div className="custom-dropdown-wrapper">
                {/* Dropdown header */}
                <div
                  className="custom-dropdown"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <img src="/svgs/downArrow.svg" alt="" />
                  <span>{selectedOption}</span>
                </div>

                {/* Options */}
                {isOpen && (
                  <div className="custom-dropdown-options">
                    {options.map((opt) => (
                      <span
                        key={opt}
                        className="custom-dropdown-option"
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsOpen(false);
                          if (qId) {
                            const userResp = questions.map((question) =>
                              question.qId === qId
                                ? {
                                    ...question,
                                    response: opt,
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
                                          response: opt,
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
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
