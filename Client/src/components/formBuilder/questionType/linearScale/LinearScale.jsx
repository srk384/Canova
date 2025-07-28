import { useState } from "react";
import "./LinearScaleStyle.css";
import { useSelector, useDispatch } from "react-redux";

const LinearScale = ({ min = 0, max = 10 }) => {
  const [value, setValue] = useState((max + min) / 2);
  const { ui } = useSelector((state) => state.uiSlice);

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
              value * 10
            }%, #ddd ${value * 10 - 100}%)`,
          }}
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={ui?.previewMode}
          className="slider"
          onChange={(e) => setValue(Number(e.target.value))}
        />

        <div
          className="thumb-label"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        >
          <div className="thumb-check">&#10003;</div>
          <span className="thumb-value">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default LinearScale;
