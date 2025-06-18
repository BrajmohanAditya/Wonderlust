
const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
  res.send("get for post");
});


router.get("/:id", (req, res) => {
  res.send("get for show post");
});


router.post("/:id", (req, res) => {
  res.send("post for show post");
});

router.delete("/:id", (req, res) => {
  res.send("post for delets post");
});

module.exports = router;