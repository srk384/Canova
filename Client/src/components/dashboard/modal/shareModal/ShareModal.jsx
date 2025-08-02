import { useState } from "react";
import "./ShareModal.css";

const ShareModal = ({ onClose, publishedLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (publishedLink) {
      navigator.clipboard.writeText(publishedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="create-project-modal-body"
      style={{ left: "275px" }}
      onClick={onClose}
    >
      <div
        className="create-project-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{marginBottom:"40px"}}>
          <img
            src="/svgs/share.svg"
            alt="Share Icon"
            className="modal-icon"
            style={{ width: "45px" }}
          />
          <h2 className="modal-title" style={{margin:"0 20px 0 0"}}>Share</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <img src="/svgs/close.svg" alt="Close" />
          </button>
        </div>

        {/* Title */}
        <p className="modal-subtitle">
          Copy and share your form link with anyone you want.
        </p>

        {/* Share Section */}
        <div className="modal-form">
          <label className="modal-label">Share</label>
          <div
            className="modal-input"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleCopyLink}
          >
            <img
              src="/svgs/link.svg"
              alt="Link Icon"
              style={{ width: "18px", height: "18px", marginRight: "8px" }}
            />
            <span
              style={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {publishedLink || "No Link Available"}
            </span>
          </div>
          {copied && (
            <span
              style={{ fontSize: "12px", color: "green", marginTop: "5px" }}
            >
              Link Copied!
            </span>
          )}

          {/* Share Button */}
          <button
            className="modal-create-btn"
            style={{ marginTop: "20px" }}
            disabled={!publishedLink}
            onClick={handleCopyLink}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
