var express = require("express");
var http = require("http");
var path = require("path");
var fs = require("fs");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://webstoreUser:Password1@cluster0.7c1jdgb.mongodb.net/?retryWrites=true&w=majority";

var app = express();

app.use(cors());


app.use(function(request, response, next){
    console.log("Request IP: " + request.url);
    console.log("Request date: " + new Date());
    next();
});

/*
app.use(function(request, response, next){
    var filePath = path.join(__dirname, "images", request.url);
    fs.stat(filePath, function(err, fileInfo){
        if(err){
            next();
            return;
        }
        if(fileInfo.isFile()){
            response.sendFile(filePath);
        } else {
            next();
        }
    });
});

app.use(function(request, response){
    response.status(404);
    response.send("File not found");
})
*/

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  let db;

// Connect to MongoDB when the application starts
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("AfterSchoolClubDB");  // Initialize 'db' after the connection is established
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

connectToMongoDB();

app.use(express.json());

app.param('collectionName', function(request, response, next, collectionName){
    request.collection = db.collection(collectionName);
    return next();
});

app.get('/collections/:collectionName', function(request, response, next){
    request.collection.find({}).toArray(function(err, results){
        if(err){
            return next(err);
        }
        response.send(results);
    });
});

http.createServer(app).listen(3000, function(){
    console.log("App started on port 3000");
});
