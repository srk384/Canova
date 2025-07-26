import { useState } from "react";
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

const FileUpload = () => {
  const [selectedTypes, setSelectedTypes] = useState([
    "image",
    "pdf",
    "ppt",
    "document",
    "video",
    "zip",
  ]);



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
          <div className="filetype-container">
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
