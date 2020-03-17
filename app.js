//declare variables and options
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = express.Router();
const port = 4000;

//variables 
var options = {
    apiVersion: 'v1', // default
    endpoint: process.env.endpoint,
    token: process.env.token
};

// get new instance of the client
var vault = require("node-vault")(options);
var keystore = 'mongodb/creds/readonly'

// get vault credentials
function get_vault_credentials() {
    var vault = require("node-vault")(options);
    return vault.read(keystore).then(v => {
        return v;
    })
    .catch(console.error);
}

// get mongoose connection 
function mongoose_connect(username,password){
    mongoose.connect(
        //"mongodb://database.default.svc.cluster.local:27017/user",
        "mongodb://database.default.svc.cluster.local:27017/user",
         {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           auth: {
             user: username,
             password: password
           }
         }
    ); 

}


//begin connection
get_vault_credentials().then(result => {
    console.log(result)
    mongoose_connect(result.data.username,result.data.password);
    const db = mongoose.connection;
    
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
        console.log("we're connected!");
        db.db.collection("users", function(err, collection){
            collection.find({}).toArray(function(err, data){
                console.log(data); // it will print your collection data
                app.get('/', (req, res) => res.send(data))
                app.listen(port, ()=>{
                    console.log('started');
                })

            })
        });
    });

});

