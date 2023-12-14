const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    "category":{
        type:String,
        required:[true, "Please provide category."],
        unique :  true,
    },
    "file":{
        type:String,
        required:[true, "Please provide file image."],
    },
    "video":{
        type:Array,
        require:[true, "Please provide file image."]
    }
})  
const Category = mongoose.model("Category", categorySchema)
module.exports = Category;