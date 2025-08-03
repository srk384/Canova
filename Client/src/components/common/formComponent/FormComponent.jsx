import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./FormComponent.css";

const FormComponent = ({ data, onShare, onRename, onDelete }) => {
  const { name, draft, id } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(name);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus on input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  const handleRenameComplete = () => {
    setIsRenaming(false);
    if (title.trim() !== name) {
      onRename(id, title.trim());
    }
  };

  return (
    <div className="homepage-recentWorks-form">
      <Link to={`/form-builder/${id}`} className="form-link">
        <h3 className="recentWorks-formName">
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRenameComplete}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameComplete();
                }
              }}
              className="rename-input"
            />
          ) : (
            <>
              <span className="recentWorks-formName-name"> {title}</span>
              <span>{draft ? "(Draft)" : ""}</span>
            </>
          )}
        </h3>

        <div className="recentWorks-img-container">
          <img src="/svgs/form.svg" alt="form icon" />
        </div>
      </Link>

      <div className="recentWorks-form-action">
        <button className="view-analysis">View Analysis</button>

        <div className="menu-container" ref={menuRef}>
          <img
            src="/svgs/threeDots.svg"
            alt="options"
            className="dots-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="popup-menu">
              <button
                disabled={draft}
                className={draft ? "disabled" : ""}
                onClick={() => {
                  if (!draft) {
                    onShare(id);
                    setMenuOpen(false);
                  }
                }}
              >
                Share
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsRenaming(true);
                }}
              >
                Rename
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
