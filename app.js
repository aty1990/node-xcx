var ejs = require("ejs");
var express = require('express')
var path = require('path')
var app = express()
var createQrcode = require('./createQrcode');

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //<u>这是ejs配置 不配置也行默认在views文件下</u>  

app.get("/open", function(req, res) {
    // str = require("fs").readFileSync(__dirname + "/views/01.ejs", "utf8") //先读文件  
    // var html = ejs.render(str, {
    //         names: ["cd", "lw"], //第一个参数是给ejs渲染的内容  
    //         filename: __dirname //第二个参数是设置include路径的 不写就找不到 报错  
    //     }) //渲染html  
    // console.log(html)
    // res.send(html) //发送给客户  

    res.render("01.ejs", {
        names: ["hello world", "lw"] //第一个参数是给ejs渲染的内容  
    })
})

createQrcode.say();

app.listen(3000, function() {
    console.log("start server at port 3000")
})