import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import "./SidebarRightStyle.css";

const SidebarRight = () => {
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const [pageColor, setPageColor] = useState("#ffffff");
  const [sectionColor, setSectionColor] = useState("#ffffff");
  const [pageOpacity, setPageOpacity] = useState(100);
  const [sectionOpacity, setSectionOpacity] = useState(100);
  const skipFirstRender = useRef(true);

  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);

  const notify = () => toast("Section Created, Add Questions Now!");

  function hexToRgb(hex, opacity) {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity === 100 ? 1 : opacity / 100})`;
  }

  useEffect(() => {
    if (skipFirstRender.current) {
      skipFirstRender.current = false;
      return;
    }
    if (pageColor || sectionColor || pageOpacity || sectionOpacity) {
      dispatch(
        setUi({
          ...ui,
          pageColor: hexToRgb(pageColor, pageOpacity),
          sectionColor: hexToRgb(sectionColor, sectionOpacity),
        })
      );
      // console.log(sectionColor);
      const updateSectiondColor = questions.map((question) =>
        question.sectionId === ui.activeSectionId
          ? {
              ...question,
              sectionColor: hexToRgb(sectionColor, sectionOpacity),
            }
          : question
      );

      dispatch(setQuestions(updateSectiondColor));

      const updatedPageColor = questions.map((question) =>
        question.pageId === ui.activePageId
          ? {
              ...question,
              pageColor: hexToRgb(pageColor, pageOpacity),
            }
          : question
      );

      dispatch(setQuestions(updatedPageColor));
    }
  }, [pageColor, sectionColor, pageOpacity, sectionOpacity]);

  // useEffect(() => {
  //   if (sections.length > 0) {
  //     dispatch(
  //       setUi({
  //         ...ui,
  //         activeSectionId: sections[sections.length - 1].sectionId,
  //       })
  //     );
  //   }
  // }, [sections]);

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
        text: "",
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

  const questionOrder = (questions, currentPageId, validTypes) => {
    // Find questions on the current page
    const questionsOnPage = questions.filter(
      (q) => q.pageId === currentPageId && validTypes.includes(q.type)
    );

    // Next order is count + 1
    return questionsOnPage.length + 1;
  };

  const elementOrder = (questions, pageId, sectionId, validTypes) => {
    // Find the section in the correct page
    const section = questions.find(
      (q) => q.pageId === pageId && q.sectionId === sectionId
    );

    // If section not found or no elements, start from 1
    if (!section || !section.elements) return 1;

    // Count valid elements inside the section
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
              // Add element only in the active page and active section
              const updatedQuestions = questions.map((question) =>
                question.sectionId === ui.activeSectionId &&
                question.pageId === ui.activePageId
                  ? {
                      ...question,
                      sectionColor: ui.sectionColor,
                      elements: [
                        ...question.elements,
                        {
                          elId: Date.now(),
                          type: "multipleChoice",
                          text: "",
                          pageId: ui.activePageId,
                          elementsOrder: elementOrder(
                            questions,
                            ui.activePageId,
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
              // No active section → add a question directly to the current page
              dispatch(
                setQuestions([
                  ...questions,
                  {
                    qId: Date.now(),
                    pageId: ui.activePageId,
                    pageColor: ui.pageColor,
                    questionOrder: questionOrder(
                      questions,
                      ui.activePageId,
                      validTypes
                    ),
                    type: "multipleChoice",
                    text: "",
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
        {/* -----------------------------add condition--------------------------------- */}
        <button
          style={{ backgroundColor: ui.addCondition ? "#69B5F8" : "" }}
          onClick={() => {
            if (questions.length > 0) {
              dispatch(
                setUi({
                  ...ui,
                  addCondition: !ui.addCondition,
                  // pageColor: `${ui.addCondition ? "white" : "#E7EEF5"}`,
                })
              );
            } else {
              alert("Add questions first");
            }
          }}
        >
          <img src="/svgs/addConditions.svg" alt="" />
          <span>Add Condition</span>
        </button>
        {/* ---------------------------------------add image---------------------------------------- */}
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

            // Create a new section on the active page
            dispatch(
              setQuestions([
                ...questions,
                {
                  sectionId: sectionId,
                  sectionColor: sectionColor,
                  pageId: ui.activePageId,
                  pageColor: ui.pageColor,
                  questionOrder: questionOrder(
                    questions,
                    ui.activePageId,
                    validTypes
                  ),
                  elements: [],
                },
              ])
            );

            // Set this new section as active
            dispatch(setUi({ ...ui, activeSectionId: sectionId }));

            notify();
          }}
        >
          <img src="/svgs/addSections.svg" alt="" />
          <span>Add Sections</span>
        </button>
      </div>

      {/* ---------------------------------------colors-------------------------------------------- */}

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
        <button
          className="formBuilder-right-sidebar-nextBTN"
          disabled={questions.length < 1 || ui.addCondition}
          onClick={() =>
            dispatch(setUi({ ...ui, showPageFlow: true, addCondition: false }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SidebarRight;
