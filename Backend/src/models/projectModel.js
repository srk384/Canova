const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // links to the User collection
    required: true
  },
  forms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
