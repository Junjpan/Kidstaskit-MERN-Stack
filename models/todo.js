const mongoose=require('mongoose');

const TodoSchema=mongoose.Schema({
   kidname:String,
   kidid:{type:mongoose.Schema.Types.ObjectId},
   title:String,
   completed:{type:Boolean,
              default:false},
   date:{type:Date,
         default:new Date()},
   points:Number,
   time:Number, 
   finishtime:{type:Number,
               default:0}  , 
   score:{type:Number,
      default:0} ,
})

module.exports=mongoose.model("Todo",TodoSchema);