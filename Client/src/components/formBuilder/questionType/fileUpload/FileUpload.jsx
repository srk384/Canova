import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";
import "./FileUploadStyle.css";
import UploadModal from "../../../common/fileUploadModal/FileUploadModal";
import { setUi } from "../../../../utils/redux/slices/uiSlice";

const FILE_TYPES = [
  "image",
  "pdf",
  "ppt",
  "document",
  "video",
  "zip",
  "audio",
  "spreadsheet",
];

const FileUpload = ({ question }) => {
  const { qId, elId, fileTypes: initialFileTypes = [] } = question;
  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);

  // Initialize state from backend-provided fileTypes
  const [selectedTypes, setSelectedTypes] = useState(initialFileTypes);

  // Sync selectedTypes when initialFileTypes from backend changes
  useEffect(() => {
    setSelectedTypes(initialFileTypes);
  }, [initialFileTypes]);

  // Update Redux when user changes selection
  const updateFileTypes = (updatedTypes) => {
    setSelectedTypes(updatedTypes);

    if (qId) {
      const updatedQuestions = questions.map((question) =>
        question.qId === qId
          ? { ...question, fileTypes: updatedTypes }
          : question
      );
      dispatch(setQuestions(updatedQuestions));
    } else if (elId) {
      const updatedQuestions = questions.map((question) => {
        if (question.elements) {
          return {
            ...question,
            elements: question.elements.map((el) =>
              el.elId === elId ? { ...el, fileTypes: updatedTypes } : el
            ),
          };
        }
        return question;
      });
      dispatch(setQuestions(updatedQuestions));
    }
  };

  // Toggle type and update
  const toggleType = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    updateFileTypes(updatedTypes);
  };

  return (
    <>
      {!ui.previewMode && (
        <div className="file-upload-container">
          <div className="settings-row">
            <label>Number of Files:</label>
            <div className="pill">5</div>
            {FILE_TYPES.slice(0, 4).map((type) => (
              <div key={type} className="filetype-container">
                <label>{type}</label>
                <input
                  className="hidden-fileupload-checkbox"
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                <span className="custom-checkbox"></span>
              </div>
            ))}
          </div>

          <div className="settings-row">
            <label>Max File Size:</label>
            <div className="pill">5mb</div>

            {FILE_TYPES.slice(4).map((type) => (
              <div className="filetype-container" key={type}>
                <label>{type}</label>
                <input
                  className="hidden-fileupload-checkbox"
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                <span className="custom-checkbox"></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ui.previewMode && (
        <>
          <button
            style={{
              padding: "15px 30px",
              border: "none",
              outline: "none",
              background: "lightGray",
              borderRadius: "5px",
              cursor: "pointer",
              margin: "20px 0 0 50px",
            }}
            onClick={() =>
              dispatch(
                setUi({
                  ...ui,
                  uploadModal: true,
                  uploadType: selectedTypes,
                  activeQuestionId: qId || elId,
                })
              )
            }
          >
            Upload
          </button>
          <ol>
            {question.response?.map((link) => (
              <li style={{ margin: "20px 0 20px 20px" }}>
                <a href={link} target="blank" style={{ color: "blue" }}>
                  Uploaded Link
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
};

export default FileUpload;
