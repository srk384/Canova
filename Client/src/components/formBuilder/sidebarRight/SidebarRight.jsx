import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 import { toast } from 'react-toastify';
import {
  setQuestions,
  setSections,
} from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import "./SidebarRightStyle.css";

const SidebarRight = () => {
  const [pageColor, setPageColor] = useState("#ffffff");
  const [sectionColor, setSectionColor] = useState("#ffffff");
  // b6b6b6
  const [pageOpacity, setPageOpacity] = useState(100);
  const [sectionOpacity, setSectionOpacity] = useState(100);

  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions, sections } = useSelector((state) => state.questionsSlice);

  const notify = () => toast("Section Created, Add Questions Now!");

  function hexToRgb(hex, opacity) {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity === 100 ? 1 : opacity / 100})`;
  }

  useEffect(() => {
    dispatch(
      setUi({
        ...ui,
        pageColor: hexToRgb(pageColor, pageOpacity),
        sectionColor: hexToRgb(sectionColor, sectionOpacity),
      })
    );
  }, [pageColor, sectionColor, pageOpacity, sectionOpacity]);


  useEffect(()=>{
    if(sections.length>0){
      dispatch(setUi({...ui, activeSectionId:sections[sections.length-1].sectionId}))
    }
  },[sections])
  return (
    <div className="formBuilder-right-sidebar">
      <div className="formBuilder-actions-btn">
        <button
          onClick={() =>
            dispatch(
              setQuestions([
                ...questions,
                {
                  qId: Date.now(),
                  pageId: ui.activePageId,
                  sectionId: ui?.activeSectionId,
                  type: "multipleChoice",
                  text: "",
                  options: ["", ""],
                },
              ])
            )
          }
        >
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
        <button
          onClick={() => {
            dispatch(
              setSections([
                ...sections,
                { sectionId: Date.now(), sectionColor: sectionColor, pageId: ui.activePageId, },
              ])
            );
            notify()
          }}
        >
          <img src="/svgs/addSections.svg" alt="" />
          <span>Add Sections</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------------------------- */}

      <label>Background Color</label>
      <div className="color-opacity-picker">
        <div
          className="color-preview"
          style={{
            backgroundColor: pageColor,
            opacity: pageOpacity / 100,
          }}
        />
        <div className="color-info">
          <span className="hex">
            {pageColor.replace("#", "").toUpperCase()}
          </span>
          <span className="divider">|</span>
          {/* <span className="opacity">{opacity}%</span> */}
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={pageOpacity}
              onChange={(e) => setPageOpacity(e.target.value)}
              className="hidden-opacity"
            />
            <span>%</span>
          </div>
        </div>

        {/* Hidden input */}
        <input
          type="color"
          value={pageColor}
          onChange={(e) => setPageColor(e.target.value)}
          className="hidden-color"
        />
      </div>

      <label>Section Color</label>
      <div className="color-opacity-picker">
        <div
          className="color-preview"
          style={{
            backgroundColor: sectionColor,
            opacity: sectionOpacity / 100,
          }}
        />
        <div className="color-info">
          <span className="hex">
            {sectionColor.replace("#", "").toUpperCase()}
          </span>
          <span className="divider">|</span>
          {/* <span className="opacity">{opacity}%</span> */}
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={sectionOpacity}
              onChange={(e) => setSectionOpacity(e.target.value)}
              className="hidden-opacity"
            />
            <span>%</span>
          </div>
        </div>

        {/* Hidden input */}
        <input
          type="color"
          value={sectionColor}
          onChange={(e) => setSectionColor(e.target.value)}
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
