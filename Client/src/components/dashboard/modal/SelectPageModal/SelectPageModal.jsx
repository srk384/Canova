import { useState } from "react";
import "./SelectPageModalStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { setUi } from "../../../../utils/redux/slices/uiSlice";
import { setConditions } from "../../../../utils/redux/slices/conditionsSlice";
import { useGetPagesQuery } from "../../../../utils/redux/api/PageAPI";
import { useParams } from "react-router-dom";

const SelectPageModal = ({ onClose, onContinue }) => {
  const [selectedTruePage, setSelectedTruePage] = useState("");
  const [selectedFalsePage, setSelectedFalsePage] = useState("");
  const { ui } = useSelector((state) => state.uiSlice);
  const { conditions } = useSelector((state) => state.conditions);
  const dispatch = useDispatch();

  const { id } = useParams();

  const { data } = useGetPagesQuery(`/get/${id}`);
  const pages = data?.form?.pages;

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue({
      truePage: selectedTruePage,
      falsePage: selectedFalsePage,
    });
    dispatch(setUi({ ...ui, addCondition: false }));
  };

  return (
    <div className="select-page-modal-body" onClick={onClose}>
      <div
        className="select-page-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="select-page-modal-header">
          <img
            src="/svgs/cube.svg"
            alt="Page Icon"
            className="select-page-modal-icon"
          />
          <button className="select-page-modal-close-btn" onClick={onClose}>
            <img src="../svgs/close.svg" alt="Close" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h2 className="select-page-modal-title">Select Page</h2>
        <p className="select-page-modal-subtitle">
          If the conditions are all met, it will lead the user to the page y
          ou’ve selected here.
        </p>

        {/* Form */}
        <form className="select-page-modal-form" onSubmit={handleSubmit}>
          {/* Select if True */}
          <label className="select-page-modal-label">
            Select, if it's True
          </label>
          <select
            value={selectedTruePage}
            onChange={(e) => {
              setSelectedTruePage(e.target.value);
              const updatedConditions = conditions.map((condition) =>
                condition.pageId === ui.activePageId
                  ? { ...condition, truePage: e.target.value }
                  : condition
              );
              dispatch(setConditions(updatedConditions));
            }}
            className="select-page-modal-input"
            required
          >
            <option value="">Select Page</option>
            {pages
              .filter((page) => page._id !== ui.activePageId)
              .map((page) => (
                <option key={page._id} value={page._id}>
                  {page.title}
                </option>
              ))}
          </select>

          {/* Select if False */}
          <label className="select-page-modal-label">
            Select, if it's False
          </label>
          <select
            value={selectedFalsePage}
            onChange={(e) => {
              setSelectedFalsePage(e.target.value);
              const updatedConditions = conditions.map((condition) =>
                condition.pageId === ui.activePageId
                  ? { ...condition, falsePage: e.target.value }
                  : condition
              );
              dispatch(setConditions(updatedConditions));
            }}
            className="select-page-modal-input"
            required
          >
            <option value="">Select Page</option>
            {pages
              .filter((page) => page._id !== ui.activePageId)
              .map((page) => (
                <option key={page._id} value={page._id}>
                  {page.title}
                </option>
              ))}
          </select>

          {/* Continue button */}
          <button className="select-page-modal-create-btn" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SelectPageModal;
