const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");
const Question = require("../models/questionModel");

const addQuestions = async (req, res) => {

  try {
    const page = await Page.findOne({_id:req.params.id});
    // console.log(req.body)

    console.log(await Question.create(req.body))
    
    res.send(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add questions" });
  }
};
const getQuestions = async (req, res) => {

  try {
    const questions = await Question.find({page:req.params.id});
    // console.log(req.body)

    // console.log(await Question.create(req.body))
    
     res.status(200).json({ message: "Questions fetched", success: true, questions: questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get questions" });
  }
};

module.exports = { addQuestions,getQuestions };
