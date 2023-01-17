const express = require("express");
const router = express.Router();
const API = require("../controllers/posts");

router.get("/", API.getAllPosts);
router.post("/", API.createPost);
router.put("/:id", API.updatePost);
router.delete("/:id", API.deletePost);

module.exports = router;