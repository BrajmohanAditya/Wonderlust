// we will store all callback  in this folder 

const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    // [ Route No: 3]
    let { id } = req.params; // req.params se URL ke :id ka value nikala ja raha hai.
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing doesnt exist");
      res.redirect("/listings");
    }
    // Ek Listing document dhundo uski id se, aur us Listing se jude saare reviews ko bhi fetch karke us Listing document mein load kar do."
    res.render("listings/show.ejs", { listing }); // show.ejs meh listing ko eject kr ka render karaga
}

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created"); // likhna zaroori hai message save karne ke liye.
    res.redirect("/listings"); // entry point per redirect kiya hu
}

module.exports.renderEditForm = async (req, res) => {
    //
    let { id } = req.params;
    const listing = await Listing.findById(id); // Listing DB meh jo id aya usko search karaga and uska sara detail store kr raha
    res.render("listings/edit.ejs", { listing }); // sara detail eject kr ka show kr raha hai,  "listings/edit.ejs" ya folder ka path hai
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect("/listings"); //   redirect kiya hai Route No: 3 per
}

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "New Listing Deleted");
  res.redirect("/listings");
};