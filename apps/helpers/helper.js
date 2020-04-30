// func hash password
var bcrypt = require("bcrypt");
var config = require("config");

function hash_password(password) {
  var saltRound = config.get("salt");

  var salt = bcrypt.genSaltSync(saltRound);
  var hash = bcrypt.hashSync(password, salt);

  return hash;
}

function compare_password(pw, hash) {
  return bcrypt.compareSync(pw, hash);
}

module.exports = {
  hash_password: hash_password,
  compare_password: compare_password
}