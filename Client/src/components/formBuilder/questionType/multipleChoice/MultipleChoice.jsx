import { useState, useRef, useEffect } from "react";
import "./MultipleChoiceStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";

const MultipleChoice = ({ id }) => {
  const [options, setOptions] = useState(["", ""]); // Start with 2 empty options
  const optionRefs = useRef([]);

  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);

  useEffect(() => {
    questions.forEach(
      (question) =>
        question.qId === id && question.options && setOptions(question.options)
    );
  }, [questions]);

  const handleChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    // setOptions(updated);
    const updatedOptions = questions.map((question) =>
      question.qId === id ? { ...question, options: updated } : question
    );
    dispatch(setQuestions(updatedOptions));
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
        <div className="option-row" key={i}>
          <input
            type="radio"
            name="option"
            disabled={ui?.previewMode}
            value={opt}
            className="hidden-radio"
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
      ))}
    </div>
  );
};

export default MultipleChoice;
