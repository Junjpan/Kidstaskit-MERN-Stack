const mongoose=require('mongoose');

const ProductSchema=mongoose.Schema({
    product:String,
    price:{type:Number,
          default:0}, 
    image:{type:String,
           default:"https://www.freeiconspng.com/uploads/no-image-icon-8.png" },
    username:'',
});

module.exports=mongoose.model('Product',ProductSchema)