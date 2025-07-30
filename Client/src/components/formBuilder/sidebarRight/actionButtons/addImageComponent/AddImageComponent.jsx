import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";
import "./AddImageComponent.css";

const AddImageComponent = ({ src }) => {
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();

  return (
    <div className="form-image-container">
      <img src={src} alt="form element" className="img" />
      <button
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
        <img src="/svgs/delete.svg" alt="" />
      </button>
    </div>
  );
};

export default AddImageComponent;
