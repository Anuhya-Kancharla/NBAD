var express = require('express');
var cookieParser = require('cookie-parser');
//const { body } = require('express-validator/check');
//const { check, validationResult } = require('express-validator/check');

var session = require('express-session');
var bodyParser = require('body-parser');
var app = module.exports = express();
var itemDb = require('../itemDB');
var UserDB = require('../UserDB');
var User = require('../model/User.js');
app.use('/assets',express.static('assets'));
var UserProfile = require('../model/UserProfile.js');
var urlencodedParser = bodyParser.urlencoded({extended : false });
var UserItem=require('../model/UserItem.js')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/florist', { useNewUrlParser: true });
var Schema = mongoose.Schema;
var expressValidator = require('express-validator');
app.use(expressValidator());

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
  secret:"this is a secret",
  resave: true,
  saveUninitialized: true
}));


app.get('/',function(req, res){
  var action = req.query.action;
  console.log("action is "+ action);
  var Item_Code_reqd = req.query.Item_Code;

  if(req.session.theUser == undefined){

      req.session.signin_info = "Not Signed in";
      req.session.signinout = "Sign_in";
      var info = "Please Sign in if you already have an account ";
      res.render('login',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});
  }

  else {

      if(action == 'SaveIt'){

            User_ID_reqd = req.session.theUser.User_ID;
          //  console.log("User Profile "+req.session.theUser.User_ID);
            UserDB.addItem(User_ID_reqd, Item_Code_reqd);

            var delayInMilliseconds = 100;
            setTimeout(function() {
                  var query2 = UserDB.getUserProfile(User_ID_reqd);
                  var promise2 = query2.exec();
                  promise2.then(function(doc){
                      req.session.UserProfile= doc;
                      var Items = doc[0].Items;
                      var profile = doc[0];

                      var  query=itemDb.getItems();
                      var promise = query.exec();
                      promise.then(function(doc){
                          var All_Items = doc;


                          res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
                      });
                  });
            }, delayInMilliseconds);
      }



      if(action == 'delete'){

          User_ID_reqd = req.session.theUser.User_ID;
        //  console.log("User Profile "+req.session.theUser.User_ID);
          var x= "";
           x = Number(Item_Code_reqd,10);


          if(isNaN(x)){
              //console.log("hellooo");
              var query2=itemDb.categories();
              var promise2 = query2.exec();
              promise2.then(function (doc) {
                Category=doc;

            var query3=itemDb.getItems();
            var promise3=query3.exec();
            promise3.then(function(doc){
                Items=doc;
                res.render('categories',{Items:Items,Category:Category,signin_info: req.session.signin_info,signinout:req.session.signinout});
            });
        });
      }
else{
          UserDB.DeleteItem(User_ID_reqd, Item_Code_reqd);

          var delayInMilliseconds = 100;
          setTimeout(function() {

              var query2 = UserDB.getUserProfile(User_ID_reqd);
              var promise2 = query2.exec();
              promise2.then(function(doc){
                  req.session.UserProfile= doc;
                  var Items = doc[0].Items;
                  var profile = doc[0];

                  var  query=itemDb.getItems();
                  var promise = query.exec();
                  promise.then(function(doc){
                        var All_Items = doc;

                        res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
                  });
              });
          }, delayInMilliseconds);
      }
    }

      /*if(action == 'Sign_in'){
        console.log("hiiiiiii");

        var info ="Welcome to our site !!!";
        res.render('login',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});

      }*/

if(action == 'Sign_out'){
  req.session.theUser = undefined;
  req.session.UserProfile = undefined;

  req.session.signin_info="Not Signed in";
  req.session.signinout="Sign_in";

  res.render('index',{signin_info: req.session.signin_info,signinout:req.session.signinout});
  }


      if(action == 'Sign_in' || action == null){

          var profile = req.session.UserProfile[0];
          var  query=itemDb.getItems();
          var promise = query.exec();
          promise.then(function(doc){
              var All_Items = doc;

              res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
          });
      }
    }

});


/////////////////////////////////////////////           POST             ////////////////////////////////////////////////////////////


app.post('/action*', urlencodedParser, function(req,res,next){

    var action = req.query.action;
    var Item_Code_reqd = req.query.Item_Code;
    console.log("post action is "+ action);



    if(action == 'feedback_Rating'){

        var User_ID_reqd = req.session.theUser.User_ID;
        var New_Rating = req.body.rating;
        UserDB.addItemRating(Item_Code_reqd, User_ID_reqd, New_Rating);


        var delayInMilliseconds = 100;

        setTimeout(function() {
            var query2 = UserDB.getUserProfile(User_ID_reqd);
            var promise2 = query2.exec();
            promise2.then(function(doc){
                req.session.UserProfile= doc;
                var Items = doc[0].Items;
                var profile= doc[0];

                var  query=itemDb.getItems();
                var promise = query.exec();
                promise.then(function(doc){
                    var All_Items = doc;

                    res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
                });
            });
        }, delayInMilliseconds);
      }


      if(action=='feedback_Tried_It'){

          var Item_Code_reqd = req.query.Item_Code;
          var New_Triedit = req.body.Tried_it;
          var User_ID_reqd = req.session.theUser.User_ID;

          UserDB.addTriedIt(Item_Code_reqd, User_ID_reqd, New_Triedit);

          var delayInMilliseconds = 100;

          setTimeout(function() {

                  var query2 = UserDB.getUserProfile(User_ID_reqd);
                  var promise2 = query2.exec();
                  promise2.then(function(doc){
                      req.session.UserProfile= doc;
                      var Items = doc[0].Items;
                      var profile = doc[0];

                      var  query=itemDb.getItems();
                      var promise = query.exec();
                      promise.then(function(doc){
                          var All_Items = doc;

                          res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
                      });
                  });
          }, delayInMilliseconds);
        }


      if(action == 'Sign_in'){

          req.check('email').isEmail().not().isEmpty();
          req.check('pswd').isLength({min:6}).not().isEmpty();

          var errors = req.validationErrors();

            console.log(errors);


           if(errors){
                   return res.status(422).json({ errors: errors });//res.render('login',{message:errors[0].msg});
           }
          else{


              var email_reqd = req.body.email;
              var password_reqd = req.body.pswd;

                  var query = UserDB.getUser_by_email(email_reqd);

                  var promise = query.exec();
                  promise.then(function(doc){
                      if(doc.length==0){
                          console.log("Incorrect Username ");
                          req.session.signin_info = "Not Signed in";
                          req.session.signinout = "Sign_in";
                          var info = "We do not find your account in our records";
                          res.render('login',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});
                    }

                      else if(doc[0].Password == password_reqd){
                        var user_ID_reqd = doc[0].User_ID;


                          req.session.theUser = new User;
                          req.session.theUser = doc[0];
                          //var query1 = UserDB.getUser(user_ID_reqd);
                          //var promise1 = query1.exec();
                          //promise1.then(function(doc){
                            //  req.session.theUser = doc[0];

                              req.session.UserProfile= new UserProfile;
                              var query2 = UserDB.getUserProfile(user_ID_reqd);
                              var promise2 = query2.exec();
                              promise2.then(function(doc){
                                  req.session.UserProfile= doc;
                                  var Items = doc[0].Items;
                                  var profile = doc[0];
                                //  console.log("profile "+profile);

                                  req.session.signin_info = "Welcome " + req.session.theUser.First_Name+" !";
                                  req.session.signinout ="Sign_out";

                                  var  query=itemDb.getItems();
                                  var promise = query.exec();
                                  promise.then(function(doc){
                                      var All_Items = doc;


                                      res.render('myitems',{profile:profile, All_Items:All_Items,signin_info: req.session.signin_info,signinout:req.session.signinout});
                                  });
                              });
                          //});
                      }


                      else {

                          req.session.signin_info = "Not Signed in";
                          req.session.signinout = "Sign_in";
                          var info = "*****Incorrect Password*****";

                          res.render('login',{info:info, signin_info: req.session.signin_info,signinout:req.session.signinout});
                      }

                  });
              }
            }


    });
