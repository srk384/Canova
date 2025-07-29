import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setQuestions,
  setSections,
} from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import "./SidebarRightStyle.css";

const SidebarRight = () => {
  const [pageColor, setPageColor] = useState("#ffffff");
  const [sectionColor, setSectionColor] = useState("#ffffff");
  const [pageOpacity, setPageOpacity] = useState(100);
  const [sectionOpacity, setSectionOpacity] = useState(100);
const skipFirstRender =  useRef(true)

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
    if(skipFirstRender.current ){
      skipFirstRender.current = false
      return
    }
    if (pageColor || sectionColor || pageOpacity || sectionOpacity) {
      dispatch(
        setUi({
          ...ui,
          pageColor: hexToRgb(pageColor, pageOpacity),
          sectionColor: hexToRgb(sectionColor, sectionOpacity),
        })
      );

      const updatedColor = questions.map((question) =>
        question.sectionId === ui.activeSectionId
          ? {
              ...question,
              sectionColor: hexToRgb(sectionColor, sectionOpacity),
              pageColor: hexToRgb(sectionColor, sectionOpacity),
            }
          : question
      );

      dispatch(setQuestions(updatedColor));
    }
  }, [pageColor, sectionColor, pageOpacity, sectionOpacity]);

  useEffect(() => {
    if (sections.length > 0) {
      dispatch(
        setUi({
          ...ui,
          activeSectionId: sections[sections.length - 1].sectionId,
        })
      );
    }
  }, [sections]);

  const addElement = (type) => {
    if (ui.activeSectionId) {
      const updatedQuestions = questions.map((question) =>
        question.sectionId === ui.activeSectionId
          ? {
              ...question,
              elements: [
                ...question.elements,
                {
                  elId: Date.now(),
                  type: "textBlock",
                  text: "",
                  // elementsOrder: question.elements.length + 1,
                },
              ],
            }
          : question
      );
      dispatch(setQuestions(updatedQuestions));
    } else {
      const newElement = {
        qId: Date.now(),
        pageId: ui.activePageId,
        // questionOrder: questions.length + 1,
        type: "textBlock",
        content: "",
      };
      dispatch(setQuestions([...questions, newElement]));
    }
  };

  const validTypes = [
    "shortAnswer",
    "longAnswer",
    "multipleChoice",
    "checkbox",
    "dropdown",
    "fileUpload",
    "date",
    "linearScale",
    "rating",
  ];

  const questionOrder =
    questions.filter((question) => validTypes.includes(question.type)).length +
    1;

  const elementOrder = (questions, sectionId, validTypes) => {
    // Find the section (or question group) where we need to count
    const section = questions.find((q) => q.sectionId === sectionId);

    if (!section || !section.elements) return 1; // If no section or empty, start from 1

    // Count only valid elements inside this section
    const count = section.elements.filter((el) =>
      validTypes.includes(el.type)
    ).length;

    return count + 1;
  };
  // console.log(questions);

  return (
    <div className="formBuilder-right-sidebar">
      <div className="formBuilder-actions-btn">
        <button
          onClick={() => {
            if (ui.activeSectionId) {
              const updatedQuestions = questions.map((question) =>
                question.sectionId === ui.activeSectionId
                  ? {
                      ...question,
                      elements: [
                        ...question.elements,
                        {
                          elId: Date.now(),
                          type: "multipleChoice",
                          text: "",
                          options: ["", ""],
                          elementsOrder: elementOrder(
                            questions,
                            ui.activeSectionId,
                            validTypes
                          ),
                        },
                      ],
                    }
                  : question
              );
              dispatch(setQuestions(updatedQuestions));
            } else {
              dispatch(
                setQuestions([
                  ...questions,
                  {
                    qId: Date.now(),
                    pageId: ui.activePageId,
                    pageColor: ui.pageColor,
                    questionOrder: questionOrder,
                    type: "multipleChoice",
                    text: "",
                    options: ["", ""],
                  },
                ])
              );
            }
          }}
        >
          <img src="/svgs/addQues.svg" alt="" />
          <span>Add Question</span>
        </button>

        <button
          onClick={() => {
            addElement("textBlock");
          }}
        >
          <img src="/svgs/addText.svg" alt="" />
          <span>Add Text</span>
        </button>

        <button>
          <img src="/svgs/addConditions.svg" alt="" />
          <span>Add Condition</span>
        </button>

        <button
          onClick={() => {
            ui?.activeSectionId
              ? dispatch(
                  setUi({ ...ui, uploadModal: true, uploadType: "image" })
                )
              : alert("Add Section first");
          }}
        >
          <img src="/svgs/addImage.svg" alt="" />
          <span>Add Image</span>
        </button>

        <button
          onClick={() => {
            ui?.activeSectionId
              ? dispatch(
                  setUi({ ...ui, uploadModal: true, uploadType: "video" })
                )
              : alert("Add Section first");
          }}
        >
          <img src="/svgs/addVideo.svg" alt="" />
          <span>Add Video</span>
        </button>

        <button
          onClick={() => {
            const sectionId = Date.now();

            dispatch(
              setQuestions([
                ...questions,
                {
                  sectionId: sectionId,
                  sectionColor: sectionColor,
                  pageId: ui.activePageId,
                  pageColor: ui.pageColor,
                  questionOrder: questions.length + 1,
                  elements: [],
                },
              ])
            );

            dispatch(setUi({ ...ui, activeSectionId: sectionId }));

            notify();
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
