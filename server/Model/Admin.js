const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    "email":{
        type : String,
        // required: [true, "Provide ID"]
    },
    "password":{
        type : String,
        // required: [true, "Provide passcode"],
        
    },
})
const Admin = mongoose.model("Admin", adminSchema)
module.exports = Admin;