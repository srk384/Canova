const Form = require("../models/formModel");
const Project = require("../models/projectModel");

const createProjectAndForm = async (req, res) => {
  const { projectName, formName } = req.body.project;
  const userId = req.user._id;
  // const userId = "687bf646dcd817e431c27af1";

  if (!projectName || !formName) {
    return res.status(400).json({ message: "Both fields are required." });
  }

  try {
    const project = await Project.create({
      name: projectName,
      owner: userId,
    });

    const form = await Form.create({
      name: formName,
      owner: userId,
      project: project._id,
      pages: [], // start empty
    });

    project.forms.push(form._id);
    await project.save();

    return res.status(201).json({
      message: "Project and form created.",
      projectId: project._id,
      formId: form._id,
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ owner: userId }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project by Id" });
  }
};

module.exports = { createProjectAndForm, getUserProjects, getProjectById };
