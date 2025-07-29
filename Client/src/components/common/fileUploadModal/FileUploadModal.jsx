import React, { useState } from "react";
import "./FileUploadModal.css";

const UploadModal = ({ isOpen, onClose, onUpload, type = "image" }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supportedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  const supportedVideoTypes = ["video/mp4", "video/webm"];
  const maxSizeImage = 25 * 1024 * 1024; // 25MB
  const maxSizeVideo = 200 * 1024 * 1024; // 200MB

  const validateFile = (file) => {
    if (type === "image" && !supportedImageTypes.includes(file.type)) {
      return "Only PNG and JPEG images are allowed.";
    }
    if (type === "video" && !supportedVideoTypes.includes(file.type)) {
      return "Only MP4 and WEBM videos are allowed.";
    }
    if (type === "image" && file.size > maxSizeImage) {
      return "File size must be less than 25MB.";
    }
    if (type === "video" && file.size > maxSizeVideo) {
      return "File size must be less than 200MB.";
    }
    return "";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const errorMsg = validateFile(selectedFile);
      if (errorMsg) {
        setError(errorMsg);
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const errorMsg = validateFile(droppedFile);
      if (errorMsg) {
        setError(errorMsg);
        setFile(null);
      } else {
        setError("");
        setFile(droppedFile);
      }
    }
  };


  // Helper to clear file and error
  const handleClose = () => {
    setFile(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span>Upload {type === "image" ? "Image" : "Video"}</span>
          <button onClick={handleClose}>✕</button>
        </div>

        <div
          className="upload-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & drop files to upload</p>
          <small>
            Max size:{" "}
            {type === "image"
              ? maxSizeImage / 1024 / 1024
              : maxSizeVideo / 1024 / 1024}{" "}
            MB
          </small>
          <input
            type="file"
            accept={
              type === "image"
                ? "image/png, image/jpeg, image/jpg"
                : "video/mp4, video/webm"
            }
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input" className="browse-btn">
            Browse Files
          </label>
          {file && !error && (
            <div className="selected-file-name">
              <p>Selected file: {file.name}</p>
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-footer">
          <button onClick={handleClose} className="cancel-btn">
            Cancel
          </button>
          <button
            onClick={async () => {
              if (file && !loading) {
                setLoading(true);
                try {
                  await onUpload(file);
                  setFile(null);
                  setError("");
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="upload-btn"
            disabled={!file || loading}
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
