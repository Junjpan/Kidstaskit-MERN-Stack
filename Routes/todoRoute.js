const express = require('express');
const router = express.Router();
const Kid = require('../models/kid');
const Todo = require('../models/todo');
const {ObjectId}=require('mongodb');
const getdate=require('../func/getdate');


router.post('/:kidid', (req, res) => {
    const { kidid } = req.params;
    const { kidname, todo, date } = req.body;
    const todosIdArray = [];
    for (var i = 0; i < todo.length; i++) {
        var newTodo = new Todo();
        newTodo.kidname = kidname;
        newTodo.kidid = kidid;
        newTodo.title = todo[i].title;
        newTodo.date = new Date(date);
        newTodo.points = todo[i].points;
        newTodo.time = todo[i].time;
        newTodo.save();
        todosIdArray.push(newTodo._id)
    }
    Kid.findById(kidid, (err, kid) => {
        kid.todo.push(...todosIdArray);
        kid.save();
    })
    res.send(`${kidname} Todo list has been saved!`)
    //
})

//retreive the todo list for requsted date and requested kid
//****todo do, kid only can pull up the current date and future date's list,
router.get("/search", (req, res) => {
    const { date, kidId, kidslogin } = req.query;
    const Time = new Date(date).getTime();
    const thismonth = new Date().getMonth() + 1;
    const thisyear = new Date().getFullYear();
    const thisday = new Date().getDate();
    const currentTime = Number(new Date(`${thismonth}/${thisday}/${thisyear}`));
    const TimeOneDayafter = Time + 24 * 60 * 60 * 1000;
    const Dayafter = new Date(TimeOneDayafter);
    //console.log(Time,currentTime);
    //console.log(date,kidId);
    if (kidId === '') {
        res.status(400).send("Error:No kid's name found,please make sure you select one of your kid before import")
    } else if (kidslogin === "true" & Time < currentTime) {
        res.status(400).send("Sorry, you only can pick the todo list for either today or days after")
    }
    else {
        //console.log(date,Dayafter)
        const query = {
            date: { $gte: new Date(date), $lt: new Date(Dayafter) },
            kidid: kidId
        }
        Todo.find(query, (err, todos) => {
            if (err) { throw err }
            else if (todos.length === 0) {
                res.status(400).send("No todo list on this date.")
            }
            else {//only send the todo list which completed is false
                if (kidslogin === "true") {
                    var incompleted = todos.filter((todo) => {
                        return todo.completed === false;
                    })
                   // console.log(incompleted)
                    if (incompleted.length === 0) { res.status(400).send("Congratulations! You have no more todo list today!") }
                    else { res.status(200).json({ todos: incompleted }) }
                } else {
                    res.status(200).json({
                        todos: todos
                    })
                }
            }
        })
    }
})

//Kids update their todolist
router.put('/kid', (req, res) => {
    var { todos } = req.body;
    //you can't use for loop
    todos.forEach((todo)=>{
        Todo.findById(todo._id,(err,data)=>{
          data.completed = todo.completed;
          data.finishtime = Number(todo.finishtime);
          data.score = parseInt(Number(todo.finishtime) / todo.time * todo.points);
          data.save();
        })
    })
    res.send(`Great Job ${todos[0].kidname}, Keep up the good works, you can find out how many points you make so far in the report center!`)
})

router.get('/kid/:kidid',(req,res)=>{   
    const {kidid}=req.params
Todo.aggregate(
        [{$match:{"kidid":ObjectId(kidid)}},
        {$group:{ _id:"null" ,        //_id:"$kidid",mean group by kidid,get the sum of all the same kidid
           total:{$sum:"$score"}
        }}],(err,result)=>{
            if(err){throw err}
            //console.log(result)
           res.status(200).json({total:result[0].total})
        }
    )
})

//get data for the past 30 days
router.get('/30days/:kidid',(req,res)=>{
    const {kidid}=req.params;
    var date=new Date()
    var current=getdate(date)
    var currentTime=current.getTime();
    var Thirtydaysbefore=currentTime-30*24*60*60*1000;
    var begin=new Date(Thirtydaysbefore)
    var onedaybefore=currentTime-24*60*60*1000;
    var end=new Date(onedaybefore)
    Todo.aggregate([
        {$match:{"kidid":ObjectId(kidid),"date":{"$gte":new Date(begin),"$lt":new Date(current)}}},
       //{$group:{_id:{year:{$year:"$date"},month:{$month:"$date"},dayOfMonth:{$dayOfMonth:'$date'}},total:{$sum:"$score"}}},        
       //{$group:{_id:{year:{$year:{date:"$date",timezone:'American/Los_Angeles'}},month:{$month:{date:"$date",timezone:'American/Los_Angeles'}},dayOfMonth:{$dayOfMonth:{date:"$date",timezone:'American/Los_Angeles'}}},total:{$sum:"$score"}}},// notworking for timze zone
     {$group:{_id:{year:{$year:{"$subtract":["$date",7*60*60*1000]}},month:{$month:{"$subtract":["$date",7*60*60*1000]}},dayOfMonth:{$dayOfMonth:{"$subtract":["$date",7*60*60*1000]}}},total:{$sum:"$score"}}},       //adjust to pacific time zone 
      //{$sort:{"date":1}}//not sorting , I don't know why  
    ],(err,result)=>{
        //console.log(result);
        res.status(200).json(result)
    })

})
module.exports = router;

