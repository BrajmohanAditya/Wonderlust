// npm intit -y : for packeg.json
// npm i express, npm i ejs, npm install mongoose
/*
You can think of it like this: app is where you've stored the entire Express application. 
All the core functionality of Express — like handling HTTP requests, defining routes, using middleware, and 
setting up the server — is stored inside the app object.
*/
require('dotenv').config(); // 👈 .env variables ko load karega

const mongoose = require("mongoose"); //  import Mongoose
const express = require("express"); // imports the Express library
const app = express();
const Listing = require("./models/listing.js"); // humneh jo .js page banaya hai uski require kiya hai. 
// why  use double dot 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");  
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
 
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
//  start  data base work 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const user = require("./models/user.js");
 

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
 const MONGO_URL = process.env.ATLASDB_URL;
   
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){   // iska kaam hai MongoDB se connection establish karna.
   await mongoose.connect(MONGO_URL); // async function ka return type promise hota hai isi liya catch use krna necessary hai
}

app.set("view engine", "ejs"); // view engine kuch type ka hota hai jish meh seh mai ejs ko use kr raha hu 
app.set("views", path.join(__dirname, "views")); //  sets the folder where Express should look for .ejs files.

app.use(express.urlencoded({extended:true}));   
/* 
Jab koi HTML form submit hota hai, to data URL-encoded format me aata hai. express.urlencoded({ extended: true }) use karne se Express is 
data ko object me badal deta hai, taki hum req.body se usko access kar sakein.
*/

/*
* MongoDB se connection banane ki koshish karo — aur jab tak connection complete na ho jaye, tab tak ruko.
* Lekin JavaScript ka nature async hota hai — matlab wo poora program rukta nahi, bas ye operation background mein chalu kar deta hai. 
 Jab connection ho jata hai (ya fail hota hai), tab future mein show karaga.  Aur async ka nature hi yeh hai ki kaam future mein kabhi complete hoga.
*Callback (ya .then() / .catch()) isliye use kiya gaya hai kyunki:
 Kaam turant nahi hota — future mein pata chalega ki hua ya nahi.
*/

// end 
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // Serve all static files (HTML, CSS, JS, images) from the public folder in the root of the project.

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", ()=>{
  console.log("Error in session store", err);
});

const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
};

app.get("/", (req, res) => {
  // it will receive call from local host
  res.send("Hi, I am root");
});


 

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req, res)=>{
//   let fakeUser = new User({
//     email: "cckumar38ar@gamil.com",
//     username: "delta_student", 
//   })
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// })



// jb v "/listings" route per call aya toh ya, const listings = require("./routes/listing.js"); yaha per aa k ./routes/listing.js file meh maping start kr dega 
app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};






// a synchoronus error handlin 


// Instead of app.all("*"), use this safer pattern:
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// app.use((err, req, res, next) => {
//   let { statusCode=500, message="something went wrong" } = err;
//   res.status(statusCode).send(message);
// });


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  req.flash("error", message);
  res.redirect("/listings"); // ya "back", agar tum previous page pe jaana chahte ho
});




app.listen(8080, ()=>{
    console.log("Listening to port 8080");
});





/*  SQL notes (init folder meh jo data hai ushper ya operation hoga)
> nmongosh (switch to mongodb in cmd)
> show dbs (sara data base show karega)
> use whatsapp
> db.dropDatabase() , Sql query fro droping db
> wonderlust> db.listings.find(), db ka ander jo listingfile hai usko nikal k dega 
> wonderlust> db.reviews.find()
> wonderlust> db.listings.find({title: "opoppp"})
> app.get: request receive krta hai and kuch serve krta hai, like koi file. 
> wonderlust> show collections
*/
  