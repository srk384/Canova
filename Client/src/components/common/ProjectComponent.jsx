import { Link } from "react-router-dom";

const ProjectComponent = ({ data }) => {
  const { name, id } = data;
  return (
    <Link to={`/projects/${id}/forms`}>
    <div className="homepage-recentWorks-project">
      <div className="recentWorks-project-top">
        <img src="../svgs/projectBig.svg" alt="project icon" />
      </div>
      <div className="recentWorks-project-bottom">
        <h3 className="recentWorks-projectName">{name}</h3>
        <img src="../svgs/threeDots.svg" alt="options" className="dots-icon" />
      </div>
    </div>
    </Link>
  );
};

export default ProjectComponent;
