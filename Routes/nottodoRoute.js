const router=require('express').Router();
const Nottodo=require('../models/nottodo');
const Kid = require('../models/kid');
const Getdate=require('../func/getdate');
const {ObjectId}=require('mongodb');

//receive the past 30 days nottodo score
router.get('/30days/:kidid',(req,res)=>{
    const {kidid}=req.params;
    var date=new Date()
    var current=Getdate(date)
    var currentTime=current.getTime();
    var Thirtydaysbefore=currentTime-30*24*60*60*1000;
    var begin=new Date(Thirtydaysbefore)
    Nottodo.aggregate([
        {$match:{kidid:ObjectId(kidid),date:{$gte:begin,$lt:current}}},
        {$sort:{date:-1}},
        {$group:{"_id":{year:{$year:{$subtract:["$date",7*60*60*1000]}},month:{$month:{$subtract:["$date",7*60*60*1000]}},dayOfMonth:{$dayOfMonth:{$subtract:["$date",7*60*60*1000]}}},"total":{$sum:"$points"}}}
    ],(err,result)=>{
       // console.log(result)
        res.send(result)
    })
})

router.post('/:kidid',(req,res)=>{
    const {kidid}=req.params; 
    const {nottodolists}=req.body
    nottodolists.forEach((nottodo) => {
        var newnottodo=new Nottodo();
        newnottodo.title=nottodo.title;
        newnottodo.kidname=nottodo.kidname;
        newnottodo.points=nottodo.points;
        newnottodo.date=nottodo.date;
        newnottodo.kidid=nottodo.kidid;
        newnottodo.save();
        Kid.findById(kidid,(err,kid)=>{
            kid.nottodo.push(newnottodo._id);
            kid.save();
        })
    });

    res.send('success')
})

//find out if there are minus points in current date
router.get('/:kidid',(req,res)=>{
    const {kidid}=req.params;
    var currentdate= Getdate(new Date())
    var time=currentdate.getTime();
    var thenextday=time+24 * 60 * 60 * 1000;
    var nextdate=new Date(thenextday);
  Nottodo.find({kidid:kidid,date:{$gte:currentdate,$lt:nextdate}},(err,nottodos)=>{
      if(err){throw err}
      else(res.status(200).json({nottodos}))
  })
})

//find out total minus points
router.get('/kid/:kidid',(req,res)=>{   
    const {kidid}=req.params
Nottodo.aggregate(
        [{$match:{"kidid":ObjectId(kidid)}},
        {$group:{ _id:"null" ,        //_id:"$kidid",mean group by kidid,get the sum of all the same kidid
           total:{$sum:"$points"}
        }}],(err,result)=>{
            if(err){throw err}
           else if(result.length>=1){
           res.status(200).json({total:result[0].total})}
            else {
           res.status(200).json({total:0})
            }
        }
    )
})


module.exports=router;

