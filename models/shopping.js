const mongoose=require('mongoose');


const ShoppingSchema=mongoose.Schema({
    username:String,
    kidid:{type:mongoose.Schema.Types.ObjectId},
    product:String,
    productid:{type:mongoose.Schema.Types.ObjectId},
    price:{type:Number,
          default:0},
    date:{type:Date,
         default:new Date()},  
    quantity:{type:Number,
      default:0},     
    total:{type:Number,
          default:0}
});

module.exports=mongoose.model('Shopping',ShoppingSchema)