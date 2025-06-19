const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // humneh jo .js page banaya hai uski require kiya hai. 
// ADD THIS in routes/listing.js
const Review = require("../models/review.js");

const{isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next)=>{
   let {error} = listingSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};



// Route No : 1 
// app.get("/Listing", async (req, res) => { ... })
// app.set("view engine", "ejs");,   app.set("views", path.join(__dirname, "views"));  ya dono code define krna hoga tabhi necha wala code chalaga 
router.get("/",wrapAsync(async(req, res) =>{ // ya .find tabhi chalaga, when you start server and call from local host  
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}) );// Entry point of this project, call "/Listing" from local host ya DB seh listing meh jo v data hai sb ko layaga or allListing meh store karega 



router.get("/new", isLoggedIn, (req, res)=>{  // Route No: 2
  res.render("listings/new.ejs");
});


// yaha request,  index.ejs seh k anker tag seh  ayaga, iska liya "url encoded ve import krna para "
router.get("/:id", wrapAsync(async(req, res)=>{
  // [ Route No: 3]
  let { id } = req.params; // req.params se URL ke :id ka value nikala ja raha hai.
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing){
    req.flash("error", "Listing doesnt exist");
    res.redirect("/listings")
  }
  // Ek Listing document dhundo uski id se, aur us Listing se jude saare reviews ko bhi fetch karke us Listing document mein load kar do."
  res.render("listings/show.ejs", { listing }); // show.ejs meh listing ko eject kr ka render karaga
}));


   // console.log(req.body); 
// Route No: 4   // ya new list add krna ka liya hai 
// Pehle req.flash() se message ko session mein store kiya jaata hai, phir middleware ke through usse res.locals mein daal kar view/template mein bheja jaata hai display ke liye.
  router.post("/",isLoggedIn, validateListing, wrapAsync (async(req, res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created"); // likhna zaroori hai message save karne ke liye.
    res.redirect("/listings"); // entry point per redirect kiya hu
  }));
   
  // Route no: 5; Edit route
  router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res)=>{ //
      let {id} = req.params; 
      const listing = await Listing.findById(id);  // Listing DB meh jo id aya usko search karaga and uska sara detail store kr raha
      res.render("listings/edit.ejs", {listing}); // sara detail eject kr ka show kr raha hai,  "listings/edit.ejs" ya folder ka path hai
  }))
   // Update route , [Route No: 6 ]
  router.put("/:id",isLoggedIn, validateListing, wrapAsync(async(req, res)=>{
      let {id} = req.params; 
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
      req.flash("success", "Listing updated");
      res.redirect("/listings"); //   redirect kiya hai Route No: 3 per 
  }));  
  
  // Delete Route, [Route No: 7]
  router.delete("/:id", isLoggedIn, wrapAsync(async(req, res)=>{
      let {id} = req.params; 
      let deletedListing = await Listing.findByIdAndDelete(id);
      req.flash("success", "New Listing Deleted");
      res.redirect("/listings");
  }));
  

  
module.exports = router;