const mongoose=require('mongoose');

const KidSchema=mongoose.Schema({
   username:String,
   kidname:String,
   userid:{type:mongoose.Schema.Types.ObjectId},
   todo:[{type:mongoose.Schema.Types.ObjectId,ref:"Todo"}],
   nottodo:[{type:mongoose.Schema.Types.ObjectId,ref:"Nottodo"}],
   shoppinglist:[{type:mongoose.Schema.Types.ObjectId,ref:"Shopping"}],
   setupdate:{type:Date, default:new Date()}
})

module.exports=mongoose.model("Kid",KidSchema);