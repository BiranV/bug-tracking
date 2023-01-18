const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  date: String,
  device: String,
  status: String,
  severity: String,
  desc: String,
  employee: String,
  time: String,
  unix: String,
  developer: String,
  note: String,
});

module.exports = mongoose.model("Post", postSchema);
