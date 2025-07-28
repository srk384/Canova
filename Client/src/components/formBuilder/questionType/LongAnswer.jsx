import { useSelector, useDispatch } from "react-redux";
const LongAnswer = () => {
  const { ui } = useSelector((state) => state.uiSlice);

  return (
    <div>
      <textarea
        name="shortAnswer"
        id="longAnswerTextarea"
        disabled={ui?.previewMode}
        placeholder="Your Answer here..."
        rows={8}
      ></textarea>
    </div>
  );
};

export default LongAnswer;
