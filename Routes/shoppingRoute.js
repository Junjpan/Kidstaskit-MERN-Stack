const router=require('express').Router();
const Shopping =require('../models/shopping');
const Kid=require('../models/kid');
const {ObjectId}=require('mongodb');

//find out total shopping amount
router.get('/kid/:kidId',(req,res)=>{
Shopping.aggregate([{$match:{kidid:ObjectId(req.params.kidId)}},
                   {$group:{_id:"null",total:{$sum:"$total"}}}],(err,result)=>{
                    if(err){throw err}
                    else if(result.length>=1){
                    res.status(200).json({total:result[0].total})}
                     else {
                    res.status(200).json({total:0})
                     }
                   })
})

//find out shopping history, if you use itemsSold:{$push:$$ROOT} you can have all the fileds of a document
router.get('/history/:kidId',(req,res)=>{
  Shopping.aggregate([{$match:{kidid:ObjectId(req.params.kidId)}},
                     {$group:{_id:"$date",itemSold:{$push:{product:'$product',quantity:"$quantity",price:"$price",total:'$total'}}}}],(err,result)=>{
                       if(err){throw err}
                      res.send(result)                      
                     })
})

//get kid the shopping list
router.post('/details/:kid_id',(req,res)=>{
  var products=req.body;
  const {kid_id}=req.params;
 products.forEach(item => {
  var shopping=new Shopping();
  shopping.price=item.price;
  shopping.product=item.product;
  shopping.username=item.username;
  shopping.productid=item.productid;
  shopping.quantity=item.quantity;
  shopping.kidid=item.kidid;
  shopping.total=item.total;
  shopping.save();
  Kid.findById(kid_id,(err,kid)=>{
    kid.shoppinglist.push(shopping._id);
    kid.save();
  }) 
 });
 res.send("Your order has been accepted.")
})


module.exports=router;