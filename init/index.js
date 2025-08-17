const mongoose =  require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const { object } = require("joi");

main()
.then(() => {
    console.log("Connected to Database.");
})

.catch((err) => {console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "688cd30bba94a40ab07813dc"}));
    await Listing.insertMany(initData.data);
    console.log("Data has been initialized.");
};

initDB();

