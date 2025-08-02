import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";
import "./LinearScaleStyle.css";

const LinearScale = ({ question }) => {
  const { qId, elId, response, text } = question;

  const min = 0;
  const max = 10;
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();

  // Handle value change and store in Redux
  const handleChange = (newValue) => {
    const numericValue = Number(newValue);

    if (qId) {
      const updated = questions.map((q) =>
        q.qId === qId ? { ...q, response: numericValue } : q
      );
      dispatch(setQuestions(updated));
    } else if (elId) {
      const updated = questions.map((q) => {
        if (q.elements) {
          return {
            ...q,
            elements: q.elements.map((el) =>
              el.elId === elId ? { ...el, response: numericValue } : el
            ),
          };
        }
        return q;
      });
      dispatch(setQuestions(updated));
    }
  };

  return (
    <div className="linear-scale-wrapper">
      <div className="linear-scale-notifier">
        <div>Scale Starting</div>
        <div>Scale Ending</div>
      </div>

      <div className="scale-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <div className="slider-container">
        <input
          style={{
            background: `linear-gradient(to right, #4da3ff ${
              ((response || (max + min) / 2) / max) * 100
            }%, #ddd ${((response || (max + min) / 2) / max) * 100}%)`,
          }}
          type="range"
          min={min}
          max={max}
          value={response ?? (max + min) / 2} 
          // disabled={ui?.previewMode}
          className="slider"
          onChange={(e) => handleChange(e.target.value)}
        />

        <div
          className="thumb-label"
          style={{
            left: `${
              (((response || (max + min) / 2) - min) / (max - min)) * 100
            }%`,
          }}
        >
          <div className="thumb-check">&#10003;</div>
          <span className="thumb-value">{response ?? (max + min) / 2}</span>
        </div>
      </div>
    </div>
  );
};

export default LinearScale;
