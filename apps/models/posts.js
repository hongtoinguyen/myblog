var q = require("q"); // promise
var db = require("../common/database");
var conn = db.getConnection();

function getAllPosts() {
  var defer = q.defer();

  var query = conn.query('SELECT * FROM posts', function (err, posts) {
    if (err) {
      defer.reject(err);
    }
    else {
      defer.resolve(posts);
    }
  });

  return defer.promise;
}

function addPost(newpost) {
  if (newpost) {
    var defer = q.defer();

    var query = conn.query('INSERT INTO posts SET ?', newpost, function (err, result) {
      if (err) {
        defer.reject(err);
      }
      else {
        defer.resolve(result);
      }
    });

    return defer.promise;
  }
  return false;
}

function getPostById(pId) {
  var defer = q.defer();

  var query = conn.query('SELECT * FROM posts WHERE ?', { id: pId }, function (err, posts) {
    if (err) {
      defer.reject(err);
    }
    else {
      defer.resolve(posts);
    }
  });

  return defer.promise;
}

function updatePost(params) {
  if (params) {
    var defer = q.defer();

    var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?',
      [params.title, params.content, params.author, new Date(), params.id], function (err, result) {
        if (err) {
          defer.reject(err);
        }
        else {
          defer.resolve(result);
        }
      });

    return defer.promise;
  }
  return false;
}

function deletePost(id) {
  if (id) {
    var defer = q.defer();

    var query = conn.query('DELETE FROM posts WHERE id = ?', id, function (err, result) {
      if (err) {
        defer.reject(err);
      }
      else {
        defer.resolve(result);
      }
    });

    return defer.promise;
  }
  return false;
}

module.exports = {
  getAllPosts: getAllPosts,
  addPost: addPost,
  getPostById: getPostById,
  updatePost: updatePost,
  deletePost: deletePost
}