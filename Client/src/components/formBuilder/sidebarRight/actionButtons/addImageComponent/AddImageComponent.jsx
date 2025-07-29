import "./AddImageComponent.css";

const AddImageComponent = ({ src }) => {
  return (
    <div className="form-image-container">
      <img src={src} alt="form element" />
    </div>
  );
};

export default AddImageComponent;
