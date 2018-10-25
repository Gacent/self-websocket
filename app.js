var express = require("express")
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");
var session = require("express-session");
var allUser = [];
//配置静态资源
app.use("/node_modules/", express.static(path.join(__dirname, 'node_modules')));
app.use("/public/", express.static(path.join(__dirname, 'public')));

//安装，配置
//使用：
//	req.session来发访问和设置session成员
//	添加session数据：req.session.foo='bar'
//	访问session数据：req.session.foo
app.use(session({
	secret: 'keyboard cat', //配置加密字符串，它会在原有加密基础上和这几个字符串拼起来再加密 
	resave: false,
	saveUninitialized: true //无论是否使用session，都默认分配一把钥匙
}))

app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/')); //默认就是./views目录,后期可以修改

app.get("/", function(req, res, next) {
	res.render("index.html")
})

app.get("/show", function(req, res, next) {
	var nk = req.query.nickname;
	if(nk == req.session.user) {
		return res.render("show.html", {
			user: req.session.user
		})
	}
	if(allUser.indexOf(nk) != -1) {
		return res.send("用户名已经存在")
	}
	allUser.push(nk)
	req.session.user = req.query.nickname;
	res.render("show.html", {
		user: req.session.user
	})
})

io.on("connection", function(socket) {
	socket.broadcast.emit("allUser",allUser)
	socket.on("content", function(msg) {
		io.emit("content", msg);
	})
	
	socket.on('disconnect',function(reason){
		console.log(reason)
	})
})

http.listen(3000, function() {
	console.log("listening")
})