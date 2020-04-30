var express = require("express");
var router = express.Router();

// ./admin
router.use("/admin", require(__dirname + "/admin"));
// ./blog
router.use("/blog", require(__dirname + "/blog"));

router.get("/", function (req, res) {
  //res.json({ "message": "This is Home Page" });
  res.render("test");
});

module.exports = router;