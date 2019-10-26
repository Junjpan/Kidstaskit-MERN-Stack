const mongoose=require('mongoose');

const NottodoSchema=mongoose.Schema({
    kidname:String,
    kidid:{type:mongoose.Schema.Types.ObjectId},
    title:String,
    date:{type:Date,
          default:new Date()},
    points:Number , 
 })
 
 module.exports=mongoose.model("NotTodo",NottodoSchema);