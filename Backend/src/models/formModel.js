const mongoose = require("mongoose");

// Element schema (for sections inside questions)
const elementSchema = new mongoose.Schema(
  {
    elId: { type: Number, required: true },
    type: { type: String, required: true }, // e.g. textBlock, image, shortAnswer
    text: String,
    src: String, // for images
    trueAnswer: String,
    options: [String],
    elementsOrder: Number,
    fileTypes: [String], // if type is fileUpload
  },
  { _id: false } // disable _id for elements
);

// Question schema
const questionSchema = new mongoose.Schema(
  {
    qId: Number, // for simple questions
    sectionId: Number, // for sections (grouped questions)
    pageId: { type: String, required: true },
    pageColor: String,
    sectionColor: String,
    questionOrder: Number,
    type: String, // for non-section questions (multipleChoice, textBlock, etc.)
    text: String,
    src: String, // if it's an image question
    trueAnswer: String,
    options: [String],
    elements: [elementSchema], // for section's inner elements
    conditions: Object,
    fileTypes: [String],
  },
  { _id: false }
);

// Page schema
const pageSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, default: "Untitled Page" },
    questions: [questionSchema],
    pageColor: { type: String, default: "#ffffff" },
  },
  { _id: false }
);

// Main Form schema
const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    pages: [pageSchema],
    access: [
      {
        email: String,
        canEdit: { type: Boolean, default: false },
      },
    ],
    views: { type: Number, default: 0 },
    isDraft: {
      type: Boolean,
      default: true,
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
