import StarSvg from "../../../svgs/StarSvg";
import "./RatingStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";

const Rating = ({ question }) => {
  const { qId, elId, response, text } = question;
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();

  const handleRatingChange = (ratingValue) => {
    if (qId) {
      const updated = questions.map((q) =>
        q.qId === qId ? { ...q, response: ratingValue } : q
      );
      dispatch(setQuestions(updated));
    } else if (elId) {
      const updated = questions.map((q) => {
        if (q.elements) {
          return {
            ...q,
            elements: q.elements.map((el) =>
              el.elId === elId ? { ...el, response: ratingValue } : el
            ),
          };
        }
        return q;
      });
      dispatch(setQuestions(updated));
    }
  };

  return (
    <div className="rating-container">
      <div className="rating-svgs">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div key={index} onClick={() => handleRatingChange(index + 1)}>
              <StarSvg fill={index < (response || 0) ? "#69B5F8" : "#D9D9D9"} />
            </div>
          ))}
      </div>
      <div className="rating-value">
        Star Count: <span>{response || 0}</span>
      </div>
    </div>
  );
};

export default Rating;
