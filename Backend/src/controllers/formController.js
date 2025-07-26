const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");

const createForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const newForm = await Form.create({
      name: "Untitled Form",
      owner: userId,
    });

    res
      .status(201)
      .json({ message: "Form created.", success: true, form: newForm });
  } catch (err) {
    console.error("Create form error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const forms = await Form.find({ owner: userId, project: null }).sort({
      createdAt: -1,
    });

    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

const getFormsByProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    const forms = await Form.find({ project: projectId, owner: userId });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

const insertFormInProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    const project = await Project.findOne({ _id: projectId, owner: userId });

    const newForm = await Form.create({
      name: "Untitled Form",
      project: projectId,
      owner: userId,
    });

    project.forms.push(newForm._id);
    await project.save();

    res.status(200).json({
      message: "Form added in the project.",
      success: true,
      form: newForm,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project by Id" });
  }
};

const getFormById = async (req, res) => {
  const formId = req.params.id;
  const userId = req.user._id;
  try {
    const form = await Form.findOne({ _id: formId, owner: userId });
    res
      .status(200)
      .json({ message: "form fetched", success: true, form: form });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch form" });
  }
};

const addPage = async (req, res) => {
  const formId = req.params.id;
  const userId = req.user._id;
  const { pageOrder } = req.body;
  try {
    const form = await Form.findOne({ _id: formId, owner: userId });

    const newPage = await Page.create({
      form: formId,
      order: pageOrder,
    });

    form.pages.push(newPage._id);
    await form.save();

    res.status(200).json({ message: "Page Added", success: true, form: form });
  } catch (err) {
    res.status(500).json({ message: "Failed to add Page" });
  }
};

const getPages = async (req, res) => {
  const formId = req.params.id;
  try {
    const pages = await Page.find({ form: formId });

    res.status(200).json({
      message: "Pages fetched with form Id",
      success: true,
      pages: pages,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get pages" });
  }
};

module.exports = {
  createForm,
  getUserForms,
  getFormsByProject,
  insertFormInProject,
  getFormById,
  addPage,
  getPages,
};
