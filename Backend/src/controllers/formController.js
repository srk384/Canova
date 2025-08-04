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
    const page = await Page.create({ form: newForm._id });

    newForm.pages.push(page._id);
    await newForm.save();

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

    const page = await Page.create({ form: newForm._id });

    newForm.pages.push(page._id);
    await newForm.save();

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
    form.views += 1;
    await form.save();
    res
      .status(200)
      .json({ message: "form fetched", success: true, form: form });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch form" });
  }
};
const deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findByIdAndDelete(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    await Page.deleteMany({ form: form._id });

    res.json({ message: "Form and pages deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const renameForm = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const form = await Form.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ message: "Form renamed successfully", form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createForm,
  getUserForms,
  getFormsByProject,
  insertFormInProject,
  getFormById,
  deleteForm,
  renameForm,
};
