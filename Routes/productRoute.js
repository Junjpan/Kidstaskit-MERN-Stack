const router = require('express').Router();
const Product = require('../models/product');
const User = require('../models/user');
const {ObjectId}=require('mongodb');


router.post('/add/:username', (req, res) => {
    const { product, price, image, username } = req.body;
    const singleproduct = new Product();
    singleproduct.product = product;
    singleproduct.price = price;
    singleproduct.image = image;
    singleproduct.username = username;
    singleproduct.save();
    User.findOne({ username: username }, (err, user) => {
        if (err) { throw err }
        user.products.push(singleproduct._id);
        user.save()
    })
    res.send("Product has been added.")

})

router.get('/:username', (req, res) => {
    const { username } = req.params;
    Product.find({ username: username })
        .sort({ date: -1 })
        .then((products) => {
            res.status(200).json({ products: products })
        })
        .catch((err)=>{throw err})
})

//update edited product
router.put('/:product_id',(req,res)=>{
    const _id=req.params.product_id
    const {price,image}=req.body;
    const editedproduct=req.body.product
    Product.findById(_id,(err,product)=>{
        product.price=price;
        product.product=editedproduct;
        product.image=image;
        product.save()
    })
    res.send("Product has been updated.")
})

//Delete product
router.delete('/delete/:productid',(req,res)=>{
    const {productid}=req.params;
    const {username}=req.query
    User.findOne({username:username},(err,user)=>{
         const index=user.products.indexOf(productid);
         user.products.splice(index,1)
         user.save() 
    })
    Product.deleteOne({_id:productid},(err)=>{
        if(err){throw err}       
        res.send('This product has been deleted.')
    })  
})

module.exports = router;