// we will store all callback  in this folder 
const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};