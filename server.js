// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
const cors = require('cors');
var MongoClient = require("mongodb").MongoClient;
var db_host ="127.0.0.1";
var db_port = "27017";
var db_name = "user_app";
var db_user = "access_user";
var db_password = "1234";

app.use(cors())
var bodyParser = require('body-parser');
const { ObjectID } = require('bson');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.jpg')
    }
});
var upload = multer({ storage: storage });

var connectionString =
  db_user + ":" + db_password + "@" + db_host + ":" + db_port;
  MongoClient.connect(
    "mongodb://" + connectionString + "/" + db_name,
    function (err, db) {
      if (err) {
        console.log("error in connection", err);
        throw err;
      }else{
        console.log("Database Connected")
      }
    }
  );
const uri= "mongodb://" + connectionString + "/" + db_name;

const client = new MongoClient(uri);
const database = client.db(db_name)
const usersCollection = database.collection("users");


// app.post('/multer', upload.single('file'));

app.post("/multer", upload.single("file"), function(req,res){
    console.log(req.file.filename);
    if(req.file.filename){
        res.send(req.file.filename)
    }
});
app.get('/users', async function (req, res) {
  console.log('inside get users');
  let result={};
  try{

    result.data=await usersCollection.find().toArray();
    res.send(result);
  }catch(err){
    console.log("error while getting users",err);
    result.err=err;
    res.send(result)
  }
});

app.post('/users',async function (req, res) {
  console.log("req.body",JSON.stringify(req.body,null,4));
let result={}
  try{
    result.data=await usersCollection.insertOne(req.body);
    res.send(result)

  }catch(err){
    console.log("error while add user",err);
    result.err=err;
    res.send(result);
  }

});

app.delete('/users/:id', async function (req, res) {
  var id = req.params.id;
  console.log(id);
  let result={}
  try{
    result.data=await usersCollection.deleteOne({"_id":new ObjectID(id)});
    res.send(result)

  }catch(err){
    console.log("error while delete user",err);
    result.err=err;
    res.send(result);
  }

});

app.get('/users/:id',async function (req, res) {
let result={};
  var id = req.params.id;
  console.log(id);
 try{
    result.data=await usersCollection.find({_id:new ObjectID(id)}).toArray()
    res.send(result)
 }catch(err){
    console.log("error while get user",err);
    result.err=err;
    res.send(result);
 }
});

app.put('/users/:id',async function (req, res) {
  var id = req.params.id;
  var user=req.body;
  let result={};
    try{
        result.data=await usersCollection.updateOne({"_id":new ObjectID(id)},{$set:{"firstname":user.firstname,"lastname":user.lastname,"email":user.email,"phone":user.phone,"profile":user.profile}});
        res.send(result);
    }catch(err){
        console.log("error while update the user",err);
        result.err=err;
        res.send(result);
    }

});

app.listen(3000);
console.log("Server running on port 3000");