const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
   username:{
       type:String,
       trim:true
   },
   password:String,
   kids:[{type:mongoose.Schema.Types.ObjectId,ref:"Kid"}],
   products:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}],
   kidsname:[String],
   rules:String,
   title:String,
})

module.exports=mongoose.model("User",UserSchema);