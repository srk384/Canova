import "./SpinnerOverlay.css";

const SpinnerOverlay = ({ loading, children }) => {
  return (
    <div className="spinner-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SpinnerOverlay;
