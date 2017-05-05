var restify = require("restify");
var firebase = require("firebase");

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var config = {
    apiKey: "AIzaSyBKoCeKMVXe5bMvJe7pAftOQ2kI1dmrFXw",
    authDomain: "my-first-app-12559.firebaseapp.com",
    databaseURL: "https://my-first-app-12559.firebaseio.com",
    projectId: "my-first-app-12559",
    storageBucket: "my-first-app-12559.appspot.com",
    messagingSenderId: "442516404572"
  };
firebase.initializeApp(config);
  
var database = firebase.database();

server.listen(8080, function() {
  console.log('Server Running On Port 8080!');
});

server.get('/getUsers', function(req, res, next) {
  var result = new Promise(function(resolve, reject) {
    
    //Ref & dbName for Firebase (weathers/)
    var weathersRef = 'users/'
    
    var weathersRef1 = database.ref(weathersRef);
    weathersRef1.once('value').then(function(snapshot) {
      var json = snapshot.val();
      var size = snapshot.numChildren();

      if (json != null) {
          size = 1;
        resolve({
          success: true,
          list: json,
          size: size
        });
      }
      else {
        resolve({
          success: false,
          message: "User ID cannot found"
        });
      }
    });
  });
  
  result.then(function(value) {
    res.send(value);
    res.end();
  })
})

server.post('/newUser',function(req, res, next){
  var result = new Promise(function(resolve, reject){
    if (req.headers['content-type'] != 'application/json'){
      resolve({
        success: false,
        message : "Json format information required"
      });
    }else{
      var json = req.body;
      var id = req.query.IdFrUser;
      var UserRef = "users/";
      
      firebase.database().ref(UserRef).set(json);
      resolve({
        success:true,
        message: "User added to database",
        studentID: id
      });
    }
  });
  result.then(function(value){
    res.send(value);
    res.end();
  });
});

server.patch("/userUp", function(req, res, next){
  var result = new Promise(function(resolve, reject){
    if (req.headers['content-type'] == 'application/json'){
      var IdFrUser = req.query.IdFrUser;
      var json = req.body;
      if (IdFrUser != null && json != null){
        var userRef = "users/list";
        firebase.database().ref(userRef).child(IdFrUser).update(json);
        resolve({
          success: true,
          message:"User Information Updated!",
          id : IdFrUser,
          update: json
        });
      }else{
        resolve({
          success: false,
          message: "Fail to update the user information"
        });
      }
    }
  });
    result.then(function(value){
    res.send(value);
    res.end();
  });
});

server.del('/userDelete', function(req, res, next){
  var result = new Promise(function (resolve, reject){
    var IdFrUser = req.query.IdFrUser;
    if (IdFrUser != null){
      var userRef = "users/list";
      firebase.database().ref(userRef).child(IdFrUser).remove();
      resolve({
        success: true,
        IdFrUser : IdFrUser
      });
    }else{
      resolve({
        success :false,
        message : "fail to delete user"
      });
    }
  });
  
  result.then(function(value){
    res.send(value);
    res.end();
  });
});
