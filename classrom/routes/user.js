const express = require("express");
const router = express.Router();
// Index - users
router.get("/", (req, res) => {
  res.send("get for users");
});

// show users
router.get("/:id", (req, res) => {
  res.send("get for show users");
});

//show- users
router.post("/:id", (req, res) => {
  res.send("post for show users");
});

router.delete("/:id", (req, res) => {
  res.send("post for delets users");
});

module.exports = router;