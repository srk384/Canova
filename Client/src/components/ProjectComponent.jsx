const ProjectComponent = () => {
  return (
    <div className="homepage-recentWorks-project">
              <div className="recentWorks-project-top">
                <img src="../svgs/projectBig.svg" alt="project icon" />
              </div>
              <div className="recentWorks-project-bottom">
                <h3 className="recentWorks-projectName">Project Name</h3>
                <img
                  src="../svgs/threeDots.svg"
                  alt="options"
                  className="dots-icon"
                />
              </div>
            </div>
  )
}

export default ProjectComponent
