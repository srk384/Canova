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
  return (
    <div style={{ padding: "30px 20px" }}>
      <textarea
        name=""
        id="addTextArea"
        rows={2}
        disabled={ui.previewMode}
        placeholder="Add text here..."
        onChange={(e) => {
          handleChange()
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
          }
        }}
      ></textarea>
    </div>
  );
};

export default AddTextComponent;
