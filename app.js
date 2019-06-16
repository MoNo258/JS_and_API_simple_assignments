var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//first assignment
app.get("/", function(req, res){
    res.send('Hi there, welcome to my assignment');
});

//funny home page
app.get ("/home",function(req, res){
    res.render("home");
});

//simple list with add possibility (no database)
var friends = ["Aa","Bb","Cc","Dd","Ee"];
app.get("/friends", function(req, res){
    res.render("friends", {friends: friends});
});

app.post("/addfriend", function(req, res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});

//search for the movie by given phrase
app.get("/search", function(req, res){
    res.render("search");
});

// search must be resonable => try California
app.get("/results", function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("results", {data: data});
        }
    });
});

//differentiation of the result depending on the given path
app.get("/speak/:animal", function(req, res){
    var sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof woof",
        cat: "I am your master",
        bunny: "mlah mlah"
    }
    var speakAnimal = req.params.animal.toLowerCase();
    var sound = sounds[speakAnimal];
    res.send("The " + speakAnimal + " says '" + sound + "'");
});

// "/repeat/word/times" as a result of proper path
app.get("/repeat/:words/:id", function(req, res){
    var repeatedWord = req.params.words;
    var repeatedTimes = Number(req.params.id);
    var resultExc = "";
    for (var i=0; i < repeatedTimes; i++){
       resultExc += repeatedWord + " "  
    }
    res.send(resultExc);
});

//small check for the 'thing' in the path
app.get ("/fallinlovewith/:thing",function(req, res){
    var thing = req.params.thing;
    // res.send("You are in love with " + thing);
    res.render("love", {thingVar: thing});
});

//any other page
app.get("*", function(req, res){
    res.send('Sorry, page not found... What the hell you were thinking!');
});

app.listen(port, function(){
    console.log('Port 3000 is working');
});