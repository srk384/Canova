import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./ProjectComponent.css";

const ProjectComponent = ({ data, onRename, onDelete }) => {
  const { name, id } = data;

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
    <div className="homepage-recentWorks-project">
      <Link
        to={`/dashboard/projects/${id}/forms`}
        state={{ projectName: name }}
        className="project-link"
      >
        <div className="recentWorks-project-top">
          <img src="/svgs/projectBig.svg" alt="project icon" />
        </div>
      </Link>

      <div className="recentWorks-project-bottom">
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRenameComplete}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameComplete();
            }}
            className="rename-input"
          />
        ) : (
          <h3 className="recentWorks-projectName">{title}</h3>
        )}

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
                onClick={() => {
                  setIsRenaming(true);
                  setMenuOpen(false);
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

export default ProjectComponent;
