var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");

var app = express();
//----- Middleware
//body parser
app.use(bodyParser.json());
//form signup - signin
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//-------------
// set up view
// template engine ejs giúp chúng ta combine data trong json và file .html để trả về file .html render đc dữ liệu động cho client
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs"); //all file .ejs in views đc nhận là template và render qua biến res của express

//static folder 
//sd router /static để truy cập file trong public (vd: /static/js or /static/css ...)
app.use("/static", express.static(__dirname + "/public"));

//khởi tạo router
var controllers = require(__dirname + "/apps/controllers");

app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port, host, function () {
  console.log("Server is running on port ", port);
});