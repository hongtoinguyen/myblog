var express = require("express");
var router = express.Router();

var user_md = require("../models/users");
var post_md = require("../models/posts");
var helper = require("../helpers/helper");

// ./admin/
router.get("/", function (req, res) {
  if (req.session.user) {
    //res.json({ "message": "This is Admin Page" });
    var data = post_md.getAllPosts();
    data.then(function (posts) {
      var data = {
        posts: posts,
        error: false
      };
      res.render("admin/dashboard", { data: data });
    }).catch(function (err) {
      res.render("admin/dashboard", { data: { error: "ERROR: Failed to get posts!" } })
    });
  }
  else {
    res.redirect("/admin/signin");
  }
});

// sign up
router.get("/signup", function (req, res) {
  res.render("signup", { data: {} });
});

router.post("/signup", function (req, res) {
  var user = req.body;

  if (user.email.trim().length == 0) {
    res.render("signup", { data: { error: "Email is required!" } });
  }

  if (user.password != user.repassword && user.password.trim().length != 0) {
    res.render("signup", { data: { error: "Password is not Match!" } });
  }

  //Insert to DB
  user = {
    email: user.email,
    password: helper.hash_password(user.password),
    first_name: user.firstname,
    last_name: user.lastname
  };
  var result = user_md.addUser(user);

  result.then(function (data) {
    //res.send(data);
    //res.json({ message: "Insert success!" });
    res.redirect("/admin/signin");
  }).catch(function (err) {
    res.render("signup", { data: { err: "error" } });
  });

  // if (!result) {
  //   res.render("signup", { data: { error: "ERROR: Cannot insert user into database!!!" } });
  // }
  // else {
  //   res.json({ message: "Insert success!" });
  // }
});

//sign in
router.get("/signin", function (req, res) {
  res.render("signin", { data: {} });
});

router.post("/signin", function (req, res) {
  var params = req.body;

  if (params.email.trim().length == 0) {
    res.render("signin", { data: { error: "Please enter your email." } });
  }
  else {
    var data = user_md.getUserByEmail(params.email);
    if (data) {
      data.then(function (users) {
        var user = users[0];
        var status = helper.compare_password(params.password, user.password);
        if (!status) {
          res.render("signin", { data: { error: "Wrong Password!!!" } });
        }
        else {
          req.session.user = user;
          //console.log(req.session.user);
          res.redirect("/admin/")
        }
      });
    }
    else {
      res.render("signin", { data: { error: "User not exist!" } });
    }
  }
});

//SHOW post
router.get("/post", function (req, res) {
  if (req.session.user) {
    res.redirect("/admin");
  }
  else {
    res.redirect("/admin/signin");
  }
});

// new post
router.get("/post/new", function (req, res) {
  if (req.session.user) {
    res.render("admin/post/new", { data: { error: false } });
  }
  else {
    res.redirect("/admin/signin");
  }
});

router.post("/post/new", function (req, res) {
  var params = req.body;

  if (params.title.trim().length == 0) {
    var data = {
      error: "ERROR: Please enter a title!"
    };
    res.render("admin/post/new", { data: data });
  }
  else {
    var now = new Date();
    params.created_at = now;
    params.updated_at = now;

    var data = post_md.addPost(params);
    data.then(function (result) {
      res.redirect("/admin");
    }).catch(function (err) {
      var data = {
        error: "ERROR: Cannot add new post!"
      };
      res.render("admin/post/new", { data: data });
    });
  }
});

//edit post
router.get("/post/edit/:id", function (req, res) {
  if (req.session.user) {
    var params = req.params;
    var id = params.id;

    var data = post_md.getPostById(id);
    if (data) {
      data.then(function (posts) {
        var post = posts[0];
        var data = {
          post: post,
          error: false
        };
        res.render("admin/post/edit", { data: data });
      }).catch(function (err) {
        var data = {
          error: "ERROR: Cannot get post by ID!"
        };
        res.render("admin/post/edit", { data: data });
      });
    }
    else {
      var data = {
        error: "ERROR: Cannot get post by ID!"
      };
      res.render("admin/post/edit", { data: data });
    }
  }
  else {
    res.redirect("/admin/signin");
  }
});

router.put("/post/edit", function (req, res) {
  var params = req.body;
  var data = post_md.updatePost(params);

  if (!data) {
    res.json({ status_code: 500 });
  }
  else {
    data.then(function (result) {
      res.json({ status_code: 200 });
    }).catch(function (err) {
      res.json({ status_code: 500 });
    });
  }
});

//delete post
router.delete("/post/delete", function (req, res) {
  var post_id = req.body.id;

  var data = post_md.deletePost(post_id);

  if (!data) {
    res.json({ status_code: 500 });
  }
  else {
    data.then(function (result) {
      res.json({ status_code: 200 });
    }).catch(function (err) {
      res.json({ status_code: 500 });
    });
  }
});

//SHOW user
router.get("/user", function (req, res) {
  if (req.session.user) {
    var data = user_md.getAllUsers();
    data.then(function (users) {
      var data = {
        users: users,
        error: false
      };
      res.render("admin/user", { data: data });
    }).catch(function (err) {
      var data = {
        error: "ERROR: Cannot get user info!"
      };
      res.render("admin/user", { data: data });
    });
  }
  else {
    res.redirect("/admin/signin");
  }
});

module.exports = router;