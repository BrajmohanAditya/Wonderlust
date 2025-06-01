// npm intit -y : for packeg.json
// npm i express, npm i ejs, npm install mongoose
/*
You can think of it like this: app is where you've stored the entire Express application. 
All the core functionality of Express — like handling HTTP requests, defining routes, using middleware, and 
setting up the server — is stored inside the app object.
*/
const mongoose = require("mongoose"); //  import Mongoose
const express = require("express"); // imports the Express library
const app = express();
const Listing = require("./models/listing.js"); // humneh jo .js page banaya hai uski require kiya hai. 
// why  use double dot 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//  start  data base work 
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";


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
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // Serve all static files (HTML, CSS, JS, images) from the public folder in the root of the project.

app.get("/", (req, res)=>{  // it will receive call from local host
    res.send("Hi, I am root");
});



//Jab aap /testlisting URL pe visit karte ho, toh ek sample listing (villa in Goa) database me save hoti hai, aur browser me "sucessful testing"
// app.get("/testlisting", async(req, res)=>{
    //let sampleListing = new Listing({ ... });
    // let sampleListing = new Listing({ // Yeh line ek naya object bana raha hai Listing model ka, aur usse sampleListing variable mein store kar raha hai.
        // title: "My New villa",
    //     description: "By the beach",
    //     price:1200,
    //     location: "goa",
    //     country:"India"
    // });
    // await sampleListing.save(); // jo let kiya usko database meh save karega, or jb tak save na ho wait karega 
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });



// Route No : 1 
// app.get("/Listing", async (req, res) => { ... })
// app.set("view engine", "ejs");,   app.set("views", path.join(__dirname, "views"));  ya dono code define krna hoga tabhi necha wala code chalaga 
app.get("/listing", async(req, res) =>{ // ya .find tabhi chalaga, when you start server and call from local host  
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
} );// Entry point of this project, call "/Listing" from local host ya DB seh listing meh jo v data hai sb ko layaga or allListing meh store karega 



app.get("/listings/new", (req, res)=>{  // Route No: 2
    res.render("listings/new.ejs");
});



// yaha request,  index.ejs seh k anker tag seh  ayaga, iska liya "url encoded ve import krna para "
app.get("/listings/:id", async(req, res)=>{  // [ Route No: 3]
    let {id} = req.params;                   // req.params se URL ke :id ka value nikala ja raha hai.
    const listing = await Listing.findById(id);  //  Mongoose ka use karke database me se uss particular listing ko dhoonda ja raha hai jiska _id match kare id se.
    res.render("listings/show.ejs", {listing});  // show.ejs meh listing ko eject kr ka render karaga
});

// Route No: 4   // ya new list add krna ka liya hai 
app.post("/listings", async(req, res)=>{
    // let{title, description, image, price, country, location} = req.body; (1st way)
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");    // entry point per redirect kiya hu 
});
// Route no: 5; Edit route
app.get("/listings/:id/edit", async(req, res)=>{ // 
    let {id} = req.params; 
    const listing = await Listing.findById(id);  // Listing DB meh jo id aya usko search karaga and uska sara detail store kr raha
    res.render("listings/edit.ejs", {listing}); // sara detail eject kr ka show kr raha hai,  "listings/edit.ejs" ya folder ka path hai
})
 // Update route , [Route No: 6 ]
app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listing"); //   redirect kiya hai Route No: 3 per 
});

// Delete Route, [Route No: 7]
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
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
> app.get: request receive krta hai and kuch serve krta hai, like koi file. 
*/
