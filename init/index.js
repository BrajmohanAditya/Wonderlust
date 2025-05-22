const mongoose = require("mongoose");
const initData = require("./data.js");
// initData - Woh data jo initial stage pe database me bharna hai.
const Listing = require("../models/listing.js");// ya schema ko require kiya 

// 1st target 
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"; // on this URL connect ot DB wonderlust 
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){   // iska kaam hai MongoDB se connection establish karna.
   await mongoose.connect(MONGO_URL); // async function ka return type promise hota hai isi liya catch use krna necessary hai
}
// 1st target end 

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data); // "initData me jo bhi data ho, usko Listing me daal do."
    console.log("data was initialized");
}

initDB();

/* path specifing ka tarika ? 
./models/listing.js: Look in the same directory (init folder). 
../models/listing.js: Look in the parent directory (majorProject), then go into the models folder.

> command to save data into data base. 

* cd init
* node index.js

*/