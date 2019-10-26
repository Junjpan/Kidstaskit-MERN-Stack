const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const userRoute=require('./Routes/userRoute');
const todoRoute=require('./Routes/todoRoute');
const reportRoute=require('./Routes/reportRoute');
const nottodoRoute=require('./Routes/nottodoRoute');
const productRoute=require('./Routes/productRoute');
const shoppingRoute=require('./Routes/shoppingRoute')


const app=express();
require('dotenv').config();
app.use(bodyParser.json());

mongoose.set('useCreateIndex',true);
mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
console.log('Connected to MongoDB...')
})


app.use('/api/',userRoute);
app.use('/api/todo',todoRoute);
app.use('/api/report',reportRoute);
app.use('/api/nottodo',nottodoRoute);
app.use('/api/products',productRoute);
app.use('/api/shopping',shoppingRoute);

//if(process.env.NODE_ENV==='production'){
//the 'catchall' hander :for any request that doesn't match the code above, send back react's index.html file
app.use(express.static(path.join(__dirname,"client/build")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build","index.html"))
})
//}
   

const port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log('Sever started on port '+port)
})