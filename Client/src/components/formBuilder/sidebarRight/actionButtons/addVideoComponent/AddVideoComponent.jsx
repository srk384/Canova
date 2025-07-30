import "./AddVideoComponent.css";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";

const AddVideoComponent = ({ src }) => {
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();
  return (
    <div className="form-video-container">
      <video src={src} controls className="video"></video>
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

export default AddVideoComponent;
