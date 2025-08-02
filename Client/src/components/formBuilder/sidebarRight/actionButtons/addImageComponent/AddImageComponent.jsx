import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";
import "./AddImageComponent.css";

const AddImageComponent = ({ src }) => {
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

  return (
    <div className="form-image-container">
      <img src={src} alt="form element" className="img" />
      <button
        className="delete-img-btn"
        onClick={() => {
          const updated = questions.map((question) =>
            question.elements?.some((el) => el.src === src)
              ? {
                  ...question,
                  elements: question.elements.filter((el) => el.src !== src),
                }
              : question
          );

          dispatch(setQuestions(updated));
        }}
      >
        {!ui.previewMode && <img src="/svgs/delete.svg" alt="" style={{width:'20px'}}/>}
      </button>
    </div>
  );
};

export default AddImageComponent;
