import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./SharedFormComponent.css";

const SharedFormComponent = ({ data, onShare, onDelete }) => {
  const { name, draft, id } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div className="homepage-recentWorks-form">
      <Link to={`/form-builder/${id}`} className="form-link">
        <h3 className="recentWorks-formName">
          <span className="recentWorks-formName-name"> {name}</span>
          <span>{draft ? "(Draft)" : ""}</span>
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
                onClick={() => {
                  onShare(id);
                  setMenuOpen(false);
                }}
              >
                Share
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

export default SharedFormComponent;
