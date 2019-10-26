const router = require('express').Router();
const User = require('../models/user');
const Kid = require('../models/kid');
const Todo = require('../models/todo');
const Nottodo = require('../models/nottodo');
const Shopping=require('../models/shopping');
const bcrypt=require('bcryptjs');
const pdf=require('html-pdf');
const Gettemplate=require('../func/template')

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    query = { username: username.toLowerCase() }
    User.find(query, (err, user) => {
        if (user.length !== 0) {
            res.status(404).json({ error: 'This username has been used, try different username.' })
        } else {
            const user = new User({ username: username.toLowerCase(), password: password });
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(user.password,salt,(err,hash)=>{
                    if(err){throw err}
                    user.password=hash;
                    user.save(() => {
                        res.send("You are registed! You can register your kids now or you can login and register your kids later in the portal. ")
                    })
                })
            })
           
        }
    })
})

//post data from register form and adding kids
router.post('/user/:username', (req, res) => {
    const { username } = req.params;
    const kids = req.body
    //console.log(username, req.body)
    User.findOne({ username: username }, (err, user) => {
        if (kids.length >= 1) {
            for (var i = 0; i < kids.length; i++) {
                var kid = new Kid();
                kid.kidname = kids[i];
                kid.username = username;
                kid.userid = user._id;
                kid.save();
                user.kids.push(kid._id)
                user.kidsname.push(kids[i])
            }
        }
        user.save()
    })
    res.status(200).send("success")
})

//parent_login, check password and username if it matchs
router.get('/login',(req,res)=>{
    const { username, password } = req.query;
    User.find({username:username},(err,user)=>{
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,isMatch)=>{
                if(isMatch===true){
                    res.status(200).json({
                        message: "You are logged in",
                        kids: user[0].kidsname,
                        kidsId: user[0].kids,
                        userid: user._id
                    });
                }else{
                    res.status(404).send("Password is incorrect, please try again.")
                }
            })

        }else{
            res.status(400).send("No such username, Please register first before login")
        }
    }) 
})

//delete kid
router.delete('/user/kid/:id', (req, res) => {
    const { id } = req.params;
    Kid.findById(id, (err, kid) => {
        if (kid) {
            const { username } = kid;
        //deleted kid from user's kids and kidsname list    
            User.findOne({ username: username }, (err, user) => {
                const index = user.kids.indexOf(id)
                user.kids.splice(index, 1);
                user.kidsname.splice(index, 1)
                user.save(); 
          Todo.deleteMany({kidid:id},(err)=>{
            if(err){throw err}
          });
          Nottodo.deleteMany({kidid:id},(err)=>{
              if(err){throw err}
          })
          Shopping.deleteMany({kidid:id},(err)=>{
              if(err){throw err}
          })


                Kid.findByIdAndDelete(id, (err, kid) => {
                    if (kid == null) { res.status(404).json({ error: "Delete error.No such a record." }) }
                    else {
                        res.status(200).json({
                            message: "delete sucess",
                            kidsArray: user.kidsname,
                            kidsId: user.kids
                        })
                    }
                })
            })
        }
        
    })
})

//Add a kid thru portal
router.post('/user/kid/add',(req,res)=>{
    console.log(req.body);
    const {username,kidname}=req.body;
    User.findOne({username:username},(err,user)=>{
      if(err){throw err}
      const newkid=new Kid();
      newkid.kidname=kidname;
      newkid.username=username;
      newkid.save();
      user.kidsname.push(kidname);
      user.kids.push(newkid._id);
      user.save();
      res.status(200).json({message:`${kidname} has been added to your portal`,
      kidsname:user.kidsname,
      kidsID:user.kids})
    })
    
})

//find rules
router.get('/user/rules/:username',(req,res)=>{   
    const {username}=req.params;
    User.findOne({username:username},(err,user)=>{
        if(err){throw err}
        else{
            res.status(200).json({title:user.title,
                                 rules:user.rules})
        }
    })
})

//post rules & title
router.post('/user/rules/:username',(req,res)=>{
    const {title,rules}=req.body;
    User.findOne({username:req.params.username},(err,user)=>{
        if(err){throw err}
        user.title=title;
        user.rules=rules;
        user.save()
        res.send("The guides/rules have been saved!")
    })
})

//transfer the rule to pdf and save as file
router.post('/rules/print',(req,res)=>{
pdf.create(Gettemplate(req.body),{}).toFile(`${__dirname}/result.pdf`,(err)=>{
    if(err){
        res.send(Promise.reject())
    }else{
        res.send(Promise.resolve())
    }
})
})

router.get('/fetch-pdf',(req,res)=>{
    res.sendFile(`${__dirname}/result.pdf`)
})


module.exports = router;