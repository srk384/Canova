import { useDispatch, useSelector } from "react-redux";
import "./SidebarRightStyle.css";
import { useEffect, useState } from "react";
import { setUi } from "../../../utils/redux/slices/uiSlice";

const SidebarRight = ({ onAddQuestion }) => {
  const [color, setColor] = useState("#ffffff");
  // b6b6b6
  const [opacity, setOpacity] = useState(100);

  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);

  function hexToRgb(hex, opacity) {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity === 100 ? 1 : opacity / 100})`;
  }

  useEffect(() => {
    dispatch(setUi({ ...ui, backgroundColor: hexToRgb(color, opacity) }));
  }, [opacity, color]);

  return (
    <div className="formBuilder-right-sidebar">
      <div className="formBuilder-actions-btn">
        <button onClick={onAddQuestion}> 
          <img src="/svgs/addQues.svg" alt="" />
          <span>Add Question</span>
        </button>
        <button>
          <img src="/svgs/addText.svg" alt="" />
          <span>Add Text</span>
        </button>
        <button>
          <img src="/svgs/addConditions.svg" alt="" />
          <span>Add Condition</span>
        </button>
        <button>
          <img src="/svgs/addImage.svg" alt="" />
          <span>Add Image</span>
        </button>
        <button>
          <img src="/svgs/addVideo.svg" alt="" />
          <span>Add Video</span>
        </button>
        <button>
          <img src="/svgs/addSections.svg" alt="" />
          <span>Add Sections</span>
        </button>
      </div>

      <label>Background Color</label>
      <div className="color-opacity-picker">
        <div
          className="color-preview"
          style={{
            backgroundColor: color,
            opacity: opacity / 100,
          }}
        />
        <div className="color-info">
          <span className="hex">{color.replace("#", "").toUpperCase()}</span>
          <span className="divider">|</span>
          {/* <span className="opacity">{opacity}%</span> */}
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
              className="hidden-opacity"
            />
            <span>%</span>
          </div>
        </div>

        {/* Hidden input */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="hidden-color"
        />
      </div>

      <label>Section Color</label>
      <div className="color-opacity-picker">
        <div
          className="color-preview"
          style={{
            backgroundColor: color,
            opacity: opacity / 100,
          }}
        />
        <div className="color-info">
          <span className="hex">{color.replace("#", "").toUpperCase()}</span>
          <span className="divider">|</span>
          {/* <span className="opacity">{opacity}%</span> */}
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
              className="hidden-opacity"
            />
            <span>%</span>
          </div>
        </div>

        {/* Hidden input */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="hidden-color"
        />
      </div>
      <div className="formBuilder-right-sidebar-next-container">
        <button className="formBuilder-right-sidebar-nextBTN">Next</button>
      </div>
    </div>
  );
};

export default SidebarRight;
