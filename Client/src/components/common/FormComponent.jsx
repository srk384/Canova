import { Link } from "react-router-dom";

const FormComponent = ({data}) => {
const {name, draft, id} = data
  return (
    <Link to={`/form-builder/${id}`}>
    <div className="homepage-recentWorks-form">
      <h3 className="recentWorks-formName">
        {name} <span>{draft ? "(Draft)":''}</span>
      </h3>

      <div className="recentWorks-img-container">
        <img src="/svgs/form.svg" alt="form icon" />
      </div>

      <div className="recentWorks-form-action">
        <button className="view-analysis">View Analysis</button>
        <img src="/svgs/threeDots.svg" alt="options" className="dots-icon" />
      </div>
    </div>
    </Link>
  );
};

export default FormComponent;
