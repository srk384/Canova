import "./DropdownStyle.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";

const Dropdown = ({ question }) => {
  const { qId, elId, qno, type, text } = question;

  const [options, setOptions] = useState(["", ""]); // Start with 2 empty options
  const optionRefs = useRef([]);

  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);

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
      {options.map((opt, i) => (
        <div className="option-row" key={i}>
          <input
            ref={(el) => (optionRefs.current[i] = el)}
            className="dropdown-option-input"
            value={opt}
            disabled={ui?.previewMode}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder={`Drop Down Option ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
