const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;
const userRoute = require('./src/routes/userRoute')
const projectsRoute = require('./src/routes/projectRoute')
const formsRoute = require('./src/routes/formsRoute')
const pagesRoute = require('./src/routes/pagesRoute')
const { connectDB } = require("./src/config/ConnectDB");


app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

connectDB()

app.use('/api/auth', userRoute)
app.use('/api/projects', projectsRoute)
app.use('/api/forms', formsRoute)
app.use('/api/pages', pagesRoute)

app.listen(port, () => {
  console.log(`Server is runnning at Port: ${port}`);
});
