import { useState } from "react";
import "./PublishModal.css"; // Using the same style file for consistency
import { useDispatch, useSelector } from "react-redux";
import { setUi } from "../../../../utils/redux/slices/uiSlice";

const PublishModal = ({ onClose }) => {
  const [responderType, setResponderType] = useState("anyone");
  const [showDropdown, setShowDropdown] = useState(false);
  const { ui } = useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

  const handlePublish = (e) => {
    e.preventDefault();
    // Do publish logic here
    dispatch(setUi({ ...ui, publish: false }));
  };

  return (
    <div className="select-page-modal-body" onClick={onClose}>
      <div className="select-page-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="publish-modal-header">
          <div className="img-title-publishModal">
            <img
              src="/svgs/cube.svg"
              alt="Publish Icon"
              className="select-page-modal-icon"
            />
            <h2 className="publish-modal-title">Publish</h2>
          </div>
          <button className="select-page-modal-close-btn" onClick={onClose}>
            <img src="../svgs/close.svg" alt="Close" />
          </button>
        </div>

        {/* Save To */}
        <div className="select-page-modal-form">
          <label className="select-page-modal-label">Save to</label>
          <div className="select-page-modal-input flex-between">
            <span>Project</span>
            <button className="link-btn">Change</button>
          </div>

          {/* Responders */}
          <label className="select-page-modal-label">Responders</label>
          <div className="select-page-modal-input flex-between">
            <span>
              {responderType === "anyone"
                ? "Anyone with the Link"
                : "Restricted Access"}
            </span>
            <button
              className="link-btn"
              onClick={(e) => {
                e.preventDefault();
                setShowDropdown((prev) => !prev);
              }}
            >
              {responderType === "anyone" ? "Anyone" : "Restricted"}
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setResponderType("anyone");
                    setShowDropdown(false);
                  }}
                >
                  Anyone
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setResponderType("restricted");
                    setShowDropdown(false);
                  }}
                >
                  Restricted
                </div>
              </div>
            )}
          </div>

          {/* Restricted mode extra fields */}
          {responderType === "restricted" && (
            <div className="restricted-section">
              <div className="restricted-item">
                <span className="avatar">E</span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  khanshahrukh384@gmail.com
                </span>
                <span className="role">Owner</span>
              </div>
              <div className="restricted-item">
                <span className="avatar">E</span>
                <span>Responder's e-mail</span>
                {/* <input className="email-input-restricted-item" type="text"placeholder="Responder's e-mail" /> */}
                <button className="link-btn">Edit</button>
              </div>
              <button className="add-mail-btn">+ Add Mails</button>
            </div>
          )}

          {/* Publish button */}
          <button
            className="select-page-modal-create-btn"
            type="button"
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
