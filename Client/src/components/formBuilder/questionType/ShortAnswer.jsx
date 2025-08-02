import { useSelector, useDispatch } from "react-redux";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";

const ShortAnswer = ({ question }) => {
  const { qId, elId, qno, type, text, options, answer } = question;

  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();
  // console.log(qno);
  const handleChange = (e) => {
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
  };

  return (
    <div>
      <textarea
        name="shortAnswer"
        id="shortAnswerTextarea"
        placeholder="Your Answer here..."
        rows={4}
        value={answer}
        // disabled={ui?.previewMode}
        onChange={handleChange}
      ></textarea>
    </div>
  );
};

export default ShortAnswer;
