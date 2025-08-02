import React, { useState, useMemo } from "react";
import "./FileUploadModal.css";

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

const allowedMimeTypes = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  video: ["video/mp4", "video/webm"],
  pdf: ["application/pdf"],
  ppt: [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  zip: ["application/zip", "application/x-zip-compressed"],
  audio: ["audio/mpeg", "audio/wav"],
  spreadsheet: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  type = "image",
  fileTypes = [],
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Determine allowed categories (from string or array)
  const allowedCategories = useMemo(() => {
    return Array.isArray(fileTypes) && fileTypes.length > 0
      ? fileTypes
      : [type];
  }, [type, fileTypes]);

  // Compute combined mime types for input accept attribute
  const acceptMimeTypes = useMemo(() => {
    return allowedCategories.flatMap(
      (category) => allowedMimeTypes[category] || []
    );
  }, [allowedCategories]);

  // Max limits (images/videos have special limits)
  const MAX_FILES =
    allowedCategories.length === 1 &&
    (allowedCategories[0] === "image" || allowedCategories[0] === "video")
      ? 1
      : 5;

  const MAX_SIZE =
    allowedCategories.length === 1
      ? allowedCategories[0] === "image"
        ? 25 * 1024 * 1024
        : allowedCategories[0] === "video"
        ? 200 * 1024 * 1024
        : 5 * 1024 * 1024
      : 5 * 1024 * 1024; // if multiple types, use 5MB limit

  const validateFiles = (selectedFiles) => {
    if (selectedFiles.length > MAX_FILES) {
      return `You can upload up to ${MAX_FILES} file${
        MAX_FILES > 1 ? "s" : ""
      } only.`;
    }

    for (const file of selectedFiles) {
      const isValidType = allowedCategories.some((category) =>
        allowedMimeTypes[category]?.includes(file.type)
      );

      if (!isValidType) {
        return `${file.name} is not a supported file type.`;
      }

      if (file.size > MAX_SIZE) {
        return `${file.name} exceeds the size limit of ${
          MAX_SIZE / 1024 / 1024
        }MB.`;
      }
    }
    return "";
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const errorMsg = validateFiles(selectedFiles);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError("");
      setFiles(selectedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const errorMsg = validateFiles(droppedFiles);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError("");
      setFiles(droppedFiles);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <span>
            Upload{" "}
            {allowedCategories.length === 1 &&
            typeof allowedCategories[0] === "string"
              ? allowedCategories[0].charAt(0).toUpperCase() +
                allowedCategories[0].slice(1)
              : "Files"}
          </span>
          <button onClick={handleClose} className="fileupload-close-btn">
            ✕
          </button>
        </div>

        {/* Upload Area */}
        <div
          className="upload-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & drop files to upload</p>
          <small>
            Max {MAX_FILES} file{MAX_FILES > 1 ? "s" : ""}, each under{" "}
            {MAX_SIZE / 1024 / 1024} MB
          </small>
          <input
            type="file"
            accept={acceptMimeTypes.join(", ")}
            onChange={handleFileChange}
            multiple={MAX_FILES > 1}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input" className="browse-btn">
            Browse Files
          </label>

          {error && <p className="error">{error}</p>}
          
          {files.length > 0 && !error && (
            <div className="selected-file-list">
              {files.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          )}
        </div>


        {/* Footer */}
        <div className="modal-footer">
          <button onClick={handleClose} className="cancel-btn">
            Cancel
          </button>
          <button
            onClick={async () => {
              if (files.length > 0 && !loading) {
                setLoading(true);
                try {
                  await onUpload(files); // pass array of files
                  setFiles([]);
                  setError("");
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="upload-btn"
            disabled={files.length === 0 || loading}
          >
            {loading ? (
              <div
                className="spinner"
                style={{
                  width: "20px",
                  height: "20px",
                  borderWidth: "3px",
                  margin: "auto",
                }}
              ></div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
