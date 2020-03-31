'use strict';


const Http = require('http');
const Express = require('express');
const mongoose = require('mongoose');
const app = Express();
var bodyParser = require('body-parser');
var Test = require('./model')
var createuser = Test.firstmethod;
var updateuser = Test.secondmethod;
var allowcors = require('cors');
app.use(bodyParser.json());
app.use(allowcors())

const mongouri = 'mongodb+srv://yuvi:yuvi@cluster0-3zndo.gcp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongouri,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.connection.on('error',function (err) {
console.log(err,'!!!!!!!!!!!!!!!!!!!!');
})
mongoose.connection.on('open',function OpenCallback() {
    console.log("connected")
})


// console.log(createmodel);

app.post('/createuser', function (req, res) {
    console.log(req.body)
    var newUser = new createuser(req.body);
    newUser.save(function (err, result) {
        if (err) { res.status(400).send({message:"something went wrong"})}
        else {
            console.log(result,"***************"); 
            res.status(201).json({result})}
    })
})


app.put('/updateuser/:id',function(req,res) {
    console.log(req.params.id)
    updateuser.findOneAndUpdate({mobile:req.params.id},req.body,{new:true},function(err, response) {
        if(err) {
            res.status(400).send({message: 'Something Went Wrong !!!'});
        } else {
            console.log(response);
            res.status(200).send(response)
        }
    })
})


// calculates the two columns value in each record  ["$moneyLeft", "$onHold"]
app.post('/calcExample', function(req, res) {
    createuser.aggregate([
        { $match : { status : true}},
        {$project : {role: 'user',total: {$add : ["$moneyLeft", "$onHold"]}}}
    ]).exec(function (err, response) {
            if(err) {
                console.log(err);
                res.status(400).send({message:'Something Went Wrong !!!'});
            } else {
                console.log(response);
                res.status(200).send(response);
            }
        }) 
})

// tells us total and along with their column values

app.post('/calctotalalongwithdisplaycolumn',function(req,res){
createuser.aggregate([
    {$match : {status:true}},
    {$project : {role:'user',
     totalAmt : {$sum : {$add : ["$moneyLeft","$onHold"]}},
     moneyLeft : {$sum :"$moneyLeft" },
     onHold : {$sum : "$onHold"}
}}
]).exec( function(err,response) {
    if(err) {
        console.log(err);
        res.status(400).send({message:'Something Went Wrong !!!'});
    } else {
        console.log(response);
        res.status(200).send(response);
    }
})
})

// tells howmany records in collection along eith required conditions

app.post('/dollarsum',function (req,res) {
    createuser.aggregate([
        { $match : {status : true,role: "user"}},{ $group : {_id:null,docCount:{$sum:1}}}
    ]).exec(function (err, result) {
        if(err) {
            console.log(err);
            res.status(400).send({message:'Something went Wrong !!!'})
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})



///////////  populate inner join /////////////

app.post('/populatejoin', function(req,res) {
    updateuser.findOne({sku : "almonds"}).populate({
        path: "createdby",match:{item:"almonds"}
    }).exec(function(err,documnet) {
        if (err) {
            console.log(err);
            res.status(400).send({message: "Something Went Wrong !!!"});
        } else {
          console.log(documnet+"$$$$$$$$$$$$$$$$$$$$$$$$$");
          res.status(200).send(documnet)
        }
    })
})


//////////////////////////lookup example ///////////////////////

app.post('/lookupexample', function (req, res) {
    updateuser.aggregate([
        {
            $match:{sku:"almonds"}
        },{
            $lookup :{
                from: 'usercreates',
                localField: 'sku',
                foreignField: 'item',
                as:'output'
            }
        }
    ]).exec(function(err, response) {
        if(err) {
         console.log(err);
        }else {
         console.log(response)
        }
    })
})



app.post('/promisesexample',function(req,res) {
    const timeOut = (t) => {
        console.log(t,"11111111111111111111")
        return new Promise((resolve, reject) => {
         if (t ===2000 ) {
         reject(`Rejected at ${t}`)
         } else  {
            setTimeout(() => {
                resolve(`Completed in ${t}`)
              }, t)
         }
        })
      }
      
      const durations = [1000, 2000, 3000]
     let promises ; 
      
     promises = durations.map((duration) => {
        console.log('4444444444444444444444444444')
        return timeOut(duration).catch(err => err) 
      })
      
      console.log(promises,"22222222222222222222") 
      Promise.all(promises)
      .then(response => {
        console.log(response,"3333333333333333333");
        res.status(200).send(response);
      })
      .catch(err => {
        console.error(err);
        res.status(400).send({message:err})
      })
    
}) 


app.post('/asyncAwait',async function(req,res,next){
const checkStatus = await querystatus(req.body);
if (checkStatus) {
    return res.status(200).send({message:checkStatus})
} else {
    return res.status(400).send({message:checkStatus});
}
})

function querystatus (body) {
return new Promise((resolve,reject) => {
    const newUserCreate = new createuser(body);
    newUserCreate.save(function (err,response) {
        if(err) {
            reject(err);
        } else {
            console.log("@@@@@@@@@@@@@@@@")
            resolve(response);
        }
    })
})
}

const server = Http.createServer(app);
server.listen(4000,'0.0.0.0', function() {
    console.log('server listening %d',4000)
});