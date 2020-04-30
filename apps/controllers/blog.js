var express = require("express");
var router = express.Router();
var post_md = require("../models/posts");
// ./blog/
router.get("/", function (req, res) {
  // res.json({ "message": "This is Blog Page" });
  var data = post_md.getAllPosts();

  data.then(function (posts) {
    var result = {
      posts: posts,
      error: false
    };
    res.render("blog/index", { data: result });
  }).catch(function (err) {
    var result = {
      error: "ERROR: Cannot load posts!"
    };
    res.render("blog/index", { data: result });
  });
});

//post detail page
router.get("/post/:id", function (req, res) {
  var data = post_md.getPostById(req.params.id);

  data.then(function (posts) {
    var post = posts[0];
    var result = {
      post: post,
      error: false
    };
    res.render("blog/post", { data: result });
  }).catch(function (err) {
    var result = {
      error: "ERROR: Cannot show a post detail!"
    };
    res.render("blog/post", { data: result });
  });
});

//about page
router.get("/about", function (req, res) {
  res.render("blog/about");
});

//contact page
router.get("/contact", function (req, res) {
  res.render("blog/contact");
});

module.exports = router;