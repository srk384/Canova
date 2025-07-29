import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../utils/redux/slices/questionsSlice";
import "./FileUploadStyle.css";

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
  const { qId, elId, qno, type, text } = question;


  const [selectedTypes, setSelectedTypes] = useState([
    "image",
    "pdf",
    "ppt",
    "document",
    "video",
    "zip",
  ]);

  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.questionsSlice);

  useEffect(() => {
   
 if (qId) {
      const fileTypes = questions.map((question) =>
      question.qId === qId ? { ...question, fileTypes: selectedTypes } : question
    );
    dispatch(setQuestions(fileTypes));

    } else if (elId) {
      const fileTypes = questions.map((question) => {
        if (question.elements) {
          return {
            ...question,
            elements: question.elements.map((el) =>
              el.elId === elId ? { ...el, fileTypes: selectedTypes } : el
            ),
          };
        }
        return question;
      });

      dispatch(setQuestions(fileTypes));
    }


  }, [selectedTypes]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="file-upload-container">
      <div className="settings-row">
        <label>Number of Files:</label>
        <div className="pill">5</div>
        {FILE_TYPES.slice(0, 4).map((type) => (
          <div key={type} className="filetype-container">
            <label key={type}>{type}</label>
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
  );
};

export default FileUpload;
