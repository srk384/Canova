import { useSelector, useDispatch } from "react-redux";
const LongAnswer = ({ question }) => {
  const { qId, elId, qno, type, text, options, answer } = question;

  const { ui } = useSelector((state) => state.uiSlice);

  return (
    <div>
      <textarea
        name="shortAnswer"
        id="longAnswerTextarea"
        value={answer}
        // disabled={ui?.previewMode}
        placeholder="Your Answer here..."
        rows={8}
      ></textarea>
    </div>
  );
};

export default LongAnswer;
