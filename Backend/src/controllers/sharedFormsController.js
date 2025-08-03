const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");

const getSharedForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;

    const sharedForms = await Form.find({
      access: {
        $elemMatch: {
          $or: [{ user: userId }, { email: email }],
        },
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json(sharedForms);
  } catch (err) {
    console.error("Error fetching shared forms:", err);
    res.status(500).json({ message: "Failed to fetch shared forms" });
  }
};

const removeSharedAccess = async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;
    const { formId } = req.params;

    // Remove user/email from access array
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        $pull: {
          access: {
            $or: [{ user: userId }, { email: email }],
          },
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res
      .status(200)
      .json({ message: "Access removed successfully", updatedForm });
  } catch (err) {
    console.error("Error removing access:", err);
    res.status(500).json({ message: "Failed to remove access" });
  }
};

module.exports = { getSharedForms, removeSharedAccess };
