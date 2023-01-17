const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const postAPI = require("./routes/posts");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 9000;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://biran:8pYSFbKYke5rWyHw@cluster0.hsipf.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.log(err));

//routes prefix
app.use("/api/posts", postAPI);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
