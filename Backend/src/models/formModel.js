const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  pages: [
    {
      title: String,
      questions: [
        {
          questionText: String,
          type: String,
          options: [String]
        }
      ]
    }
  ],
  access: [
    {
      email: String,
      canEdit: Boolean
    }
  ],
  isDraft: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Form", formSchema);
