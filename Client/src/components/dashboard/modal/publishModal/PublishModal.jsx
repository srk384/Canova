import { useState } from "react";
import "./PublishModal.css"; // Using the same style file for consistency
import { useDispatch, useSelector } from "react-redux";
import { setUi } from "../../../../utils/redux/slices/uiSlice";
import {
  useGetSavedDraftQuery,
  useSaveDraftMutation,
} from "../../../../utils/redux/api/draftPublishAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PublishModal = ({ id, onClose }) => {
  const [responderType, setResponderType] = useState("anyone");
  const [showDropdown, setShowDropdown] = useState(false);
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();
  const { data } = useGetSavedDraftQuery(id);
  const [saveDraft, { isLoading }] = useSaveDraftMutation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [access, setAccess] = useState([]);

  function attachQuestionsToPages(form, questions) {
    return {
      ...form,
      name: ui.formName,
      access: access,
      pages: form.pages.map((page) => ({
        ...page,
        questions: questions.filter((q) => q.pageId === page._id),
      })),
    };
  }

  const handlePublish = async (e) => {
    e.preventDefault();

    const updatedForm = attachQuestionsToPages(data.form, questions);
    console.log(updatedForm);

    try {
      const { data } = await saveDraft({
        action: `${id}/publish`,
        form: updatedForm,
      });

      console.log(data);
      if (data.message.includes("Form published successfully")) {
        toast.success("Form published successfully!");
        // navigate(`/dashboard`);

        dispatch(
          setUi({
            ...ui,
            showShareModal: true,
            publishedLink: data?.publishUrl,
            publish: false,
            showPageFlow: false,
          })
        );
      }
    } catch (error) {
      toast.error("Oops! There is some error.");
      console.log(error);
    }
  };

  // State to match schema format

  // Add new user entry
  const handleAddEmail = () => {
    setAccess((prev) => [...prev, { email: "", canEdit: false }]);
  };

  // Update email value
  const handleEmailChange = (index, value) => {
    setAccess((prev) => {
      const updated = [...prev];
      updated[index].email = value;
      return updated;
    });
  };

  const handleToggleCanEdit = (index) => {
    setAccess((prev) => {
      // copy array
      const updated = [...prev];
      // toggle canEdit for the user at index
      updated[index] = {
        ...updated[index],
        canEdit: !updated[index].canEdit,
      };
      return updated;
    });
  };

  // Remove email entry
  const handleRemoveEmail = (index) => {
    setAccess((prev) => prev.filter((_, i) => i !== index));
  };

  console.log(access);
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
                    setAccess([""]);
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
              {/* Owner info */}
              <div className="restricted-item">
                <span className="avatar">E</span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.email}
                </span>
                <span className="role">Owner</span>
              </div>

              {!showEmailInput && (
                <button
                  className="add-mail-btn"
                  onClick={() => {
                    setShowEmailInput(true);

                    // Add first item if empty
                    if (access.length === 0) {
                      setAccess([{ email: "", canEdit: false }]);
                    }
                  }}
                >
                  + Add Mails
                </button>
              )}

              {/* Email Input List */}
              {showEmailInput && (
                <>
                  {access.map((user, index) => (
                    <div className="restricted-item" key={index}>
                      <span className="avatar">E</span>
                      <input
                        className="email-input-restricted-item"
                        type="email"
                        placeholder="Responder's e-mail"
                        value={user.email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                      />

                      <label className="can-edit-toggle">
                        <input
                          type="checkbox"
                          checked={user.canEdit}
                          onChange={() => handleToggleCanEdit(index)} // <-- pass only index
                        />
                        Can Edit
                      </label>

                      <button
                        className="link-btn"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button className="add-mail-btn" onClick={handleAddEmail}>
                    + Add Mails
                  </button>
                </>
              )}
            </div>
          )}

          {/* Publish button */}
          <button
            className="select-page-modal-create-btn"
            type="button"
            onClick={handlePublish}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="spinner"
                style={{
                  width: "20px",
                  height: "20px",
                  borderWidth: "3px",
                  margin: "auto",
                  backgroundColor: "transparent",
                }}
              ></div>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
