const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  Date: String,
  Type: String,
  Status: String,
  Severity: String,
  Description: String,
  Employee: String,
  Time: String,
  TimeUnix: String,
  Note: String,
  Developer: String,
});

module.exports = mongoose.model("Post", postSchema);
