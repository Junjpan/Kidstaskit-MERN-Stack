const express = require('express');
const route = express.Router();
const Kid = require('../models/kid');
const Todo = require('../models/todo');
const Nottodo=require('../models/nottodo');
const getdatefunc = require('../func/getdate');

route.get('/:kidid', (req, res) => {
  //console.log(req.params,req.query);
  const { kidid } = req.params;
  const { startdate, enddate } = req.query;
  var start = getdatefunc(startdate);
  var end = getdatefunc(enddate);
  const Time = new Date(end).getTime();
  const TimeOneDayafter = Time + 24 * 60 * 60 * 1000;
  var onedayafterendday = new Date(TimeOneDayafter);
  const query = {
    kidid: kidid,
    date: { $gte: start, $lt: onedayafterendday }
  }
  if (start.getTime() > end.getTime()) {
    res.status(400).send("Please make sure the start date either smaller or equal the end date.")
  } else {

    Todo.find(query)
      .sort({ date: -1 })
      .then((todos) => {
        /** 
        if (todos.length == 0) {
          res.status(400).send("There are no todo list during the timeframe you pick.")
        } else {*/
          Nottodo.find(query)
                 .sort({date:-1})
                 .then((nottodos)=>{
                   res.status(200).json({todos:todos,nottodos:nottodos})
                 })
                 .catch((err)=>{throw err})
        } )
      .catch((err)=>{throw err})


  }


})


module.exports = route;
