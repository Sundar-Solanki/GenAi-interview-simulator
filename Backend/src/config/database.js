const mongoose = require("mongoose");

async function ConnectToDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected To Database Successfully...");
    }catch(err){
        console.log(err)
    }
}

module.exports = ConnectToDB;