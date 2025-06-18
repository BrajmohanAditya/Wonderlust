const express = require("express");
const app = express();
const users = require("./routes/user.js"); // file ko require kiya hu 
const posts = require("./routes/post.js"); // file ko require kiya hu 
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")

app.set("view engine", "ejs"); // view engine kuch type ka hota hai jish meh seh mai ejs ko use kr raha hu 
app.set("views", path.join(__dirname, "views")); //  sets the folder where Express should look for .ejs files.

app.use(session({ secret: "mysupersecret", resave:false, saveUninitialized:true }));
app.use(flash());


app.get("/register", (req, res)=>{
    let{name = "unknown"} = req.query;
    req.session.name = name;
    req.flash("success", "user registered sucessfully");
    res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
    res.locals.messages = req.flash("success");
    res.render("page.ejs", {name: req.session.name});
});



















// app.get("/test", (req, res)=>{
//     res.send("test sucessful");
// })

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })


// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcode"));


// app.get("/getsignedcookie", (req, res)=>{
//     res.cookie("made-in", "india", {signed:true});
//     res.send("signed cookies sent");
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies", (req, res)=>{
//     res.cookie("greet", "hello");
//     res.send("sent you some cookies");
// });

// app.get("/greet", (req, res)=>{
//     let{name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// });

// app.get("/", (req, res)=>{
//     console.dir(req.cookies)
//     res.send("Hi i am root");
// });

app.listen(3000, ()=>{
    console.log("server is listening to 3000");
});

