import { useDispatch, useSelector } from "react-redux";
import "./AddTextComponentStyle.css";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";

const AddTextComponent = ({ question }) => {
  const { qId, elId, qno, type, text, options } = question;
  const { questions } = useSelector((state) => state.questionsSlice);

  const { ui } = useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  const handleChange = () => {
    document
      .querySelector("#addTextArea")
      ?.addEventListener("input", autoResize);
  };

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

      dispatch(setQuestions(updated));
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

      dispatch(setQuestions(updated));
    }

    // Allow Enter default behavior only for shift+enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };
  return (
    <div style={{ padding: "30px 20px" }}>
      <textarea
        name=""
        id="addTextArea"
        rows={2}
        value={text}
        disabled={ui.previewMode}
        placeholder="Add text here..."
        onKeyDown={handleKeyDown}
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
              if (question.elements) {
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
              return question;
            });

            dispatch(setQuestions(updatedQuestion));
          };
          handleChange();
        }}
      ></textarea>
    </div>
  );
};

export default AddTextComponent;
