import { useSelector, useDispatch } from "react-redux";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";

const ShortAnswer = ({ qno }) => {
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();
  // console.log(qno);
  const handleChange = (e) => {
    // const answer = questions.map((question)=>(
    //   question.qno===qno ? {...question, answerValue:e.target.value}: question
    // ))

    // dispatch(setQuestions(answer))
  };

  return (
    <div>
      <textarea
        name="shortAnswer"
        id="shortAnswerTextarea"
        placeholder="Your Answer here..."
        rows={4}
        onChange={handleChange}
      ></textarea>
    </div>
  );
};

export default ShortAnswer;
