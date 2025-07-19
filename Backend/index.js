const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;
const userRoute = require('./src/routes/userRoute')

app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use('/api/auth', userRoute)

app.listen(port, () => {
  console.log(`Server is runnning at Port: ${port}`);
});
