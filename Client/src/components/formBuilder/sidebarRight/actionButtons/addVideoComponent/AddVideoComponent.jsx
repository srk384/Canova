import "./AddVideoComponent.css";

const AddVideoComponent = ({ src }) => {
  return (
    <div className="form-video-container">
      <video src={src} controls ></video>
    </div>
  );
};

export default AddVideoComponent;
