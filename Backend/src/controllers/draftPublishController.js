const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");
const User = require("../models/userModel");


const saveDraft = async (req, res) => {
  const { formId } = req.params;
  const { name, pages, isDraft } = req.body.form;

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $set: { name, pages: pages, isDraft } },
      {
        new: true, // return the updated document
        runValidators: true, // validate against schema
      }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res
      .status(200)
      .json({ message: "form updated", success: true, form: updatedForm });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update form", error: err.message });
  }
};

const getSavedDraft = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) return res.status(404).json({ message: "Form not found" });

    res
      .status(200)
      .json({ message: "form fetched", success: true, form: form });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching form", error: err.message });
  }
};

const publishForm = async (req, res) => {
  const { formId } = req.params;
  const { name, pages, access } = req.body.form;

  try {

    const updatedAccess = await Promise.all(
      access.map(async (acc) => {
        const accUser = await User.findOne({ email: acc.email });
        return {
          user: accUser ? accUser._id : null, // if user exists, store _id
          email: acc.email,
          canEdit: acc.canEdit || false,
        };
      })
    );

    // Update form
    const publishedForm = await Form.findByIdAndUpdate(
      formId,
      {
        $set: {
          name,
          pages,
          isDraft: false,
          access: updatedAccess, // save access with userId
          publishedAt: new Date(),
        },
      },
      {
        new: true, // return updated doc
        runValidators: true,
      }
    );

    if (!publishedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.status(200).json({
      message: "Form published successfully",
      publishedForm,
      publishUrl: `${process.env.FRONTEND_URL}/forms/${publishedForm._id}/verify`,
    });
  } catch (error) {
    console.error("Error publishing form:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { saveDraft, getSavedDraft, publishForm };
