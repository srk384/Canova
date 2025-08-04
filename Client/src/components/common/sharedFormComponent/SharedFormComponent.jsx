import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./SharedFormComponent.css";
import { useGetFormPublicMutation } from "../../../utils/redux/api/FormPublicAPI";
import { setBuilderState } from "../../../utils/redux/slices/builderStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import { toast } from "react-toastify";

const SharedFormComponent = ({ data, onShare, onDelete }) => {
  const { name, draft, id } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [getFormPublic, { isLoading, isError }] = useGetFormPublicMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { builderState } = useSelector((state) => state.builderState);
  const { user } = useSelector((state) => state.user);
  const { ui } = useSelector((state) => state.uiSlice);

  const handleSubmit = async () => {
    const email = user.email;

    const response = await getFormPublic({
      action: `/form/${id}`,
      email: email,
    }).unwrap();

    if (!response?.form) {
      toast.error("Form data missing");
      return;
    }

    const form = response.form;

    dispatch(
      setBuilderState({
        ...builderState,
        activePage: form.pages[0]?._id || "",
        pages: form.pages,
        form: form,
      })
    );

    const questionsBD = form.pages.flatMap((page) =>
      page.questions.map((q) => ({
        ...q,
        pageId: page._id,
        pageTitle: page.title,
      }))
    );

    dispatch(setQuestions(questionsBD));

    dispatch(
      setUi({
        ...ui,
        userEmail: email,
        previewMode: true,
        data: response,
      })
    );

    navigate(`/forms/${form._id}/respond`);
    toast.success(`Welcome!, ${email}`);
  };

  return (
    <div className="homepage-recentWorks-form">
      <div onClick={handleSubmit}>
        <h3 className="recentWorks-formName">
          <span className="recentWorks-formName-name"> {name}</span>
          <span>{draft ? "(Draft)" : ""}</span>
        </h3>

        <div className="recentWorks-img-container">
          <img src="/svgs/form.svg" alt="form icon" />
        </div>
      </div>

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
