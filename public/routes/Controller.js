var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = module.exports = express();
var itemDb = require('../itemDB');
var UserDB = require('../UserDB');
var User = require('../model/User.js');
app.use('/assets',express.static('assets'));
var UserProfile = require('../model/UserProfile.js');
var urlencodedParser = bodyParser.urlencoded({extended : false });
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/florist', { useNewUrlParser: true });

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
  secret:"this is a secret",
  resave: false,
  saveUninitialized: true
}));



var session_User = function(req, res, next){
    if(req.session.theUser == undefined){
        req.session.signin_info = "Not Signed in";
        req.session.signinout = "Sign_in";
    }
    next();
}

app.use(session_User);



//--------------------------------------------------------HOME PAGE--------------------------------------------------

app.get('/',function(req, res){
    res.render('index', {signin_info:req.session.signin_info,signinout:req.session.signinout});
});

//----------------------------------Register------------------------------------------------------------

app.get('/register',function(req, res){
    res.render('register', {signin_info:req.session.signin_info,signinout:req.session.signinout});
});

app.post('/register',urlencodedParser,function(req, res){
   UserDB.addUser(req.body.id,req.body.pswd,req.body.fname,req.body.lname,req.body.email,req.body.ad1,req.body.ad2,req.body.city,req.body.state,req.body.zip,req.body.country);

  var info = "Please Login now"
    res.render('login',{info:info, signin_info: req.session.signin_info,signinout:req.session.signinout})

});


//----------------------------------New Item------------------------------------------------------------

app.get('/new_item',function(req, res){
    res.render('new_item', {signin_info:req.session.signin_info,signinout:req.session.signinout});
});

app.post('/new_item',urlencodedParser,function(req, res){
  var user=req.session.theUser.User_ID;
  itemDb.additem(req.body.code,req.body.name,req.body.category,req.body.desc,req.body.rating,req.body.url,user);

  var info = "Please Login now"
    res.render('login',{info:info, signin_info: req.session.signin_info,signinout:req.session.signinout})

});
//----------------------------------Categories------------------------------------------------------------

app.get('/categories', function (req, res) {

    var Items = [];
    var Category=[];

    var query1=itemDb.categories();
    var promise1 = query1.exec();
    promise1.then(function (doc) {
        Category=doc;
        var query2=itemDb.getItems();
        var promise2=query2.exec();
        promise2.then(function(doc){
            Items=doc;
            res.render('categories',{Items:Items,Category:Category,signin_info: req.session.signin_info,signinout:req.session.signinout});
        });
    });
});

//----------------------------------------------------------ITEM PAGE-------------------------------------------------------------


app.get('/item/:Item_Code',function(req, res){
  var Item_Code_reqd = req.params.Item_Code;
  //console.log(Item_Code_reqd);
    var query1 = itemDb.getItem(Item_Code_reqd);
    var promise1=query1.exec();
    promise1.then(function(doc){
        if(doc.length!=0){
            var Item = doc;
            res.render('item',{data:Item,signin_info: req.session.signin_info,signinout:req.session.signinout});
        }

        else{
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
    });

});


//----------------------------------------FEEDBACK PAGE-------------------------------------------------------------


app.get('/feedback/:Item_Code',function(req, res){
    var Item_Code_reqd = req.params.Item_Code;

    if(req.session.theUser==undefined){
        console.log("*****Please log in to your profile to save your feedback*****");
        req.session.signin_info = "Not Signed in";
        req.session.signinout = "Sign_in";
        var info = "******Please log in to your profile to save your feedback*****";
        res.render('login',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});
    }


    else{
      x = Number(Item_Code_reqd,10);


     if(isNaN(x)){
       //  console.log("hellooo");
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


        var Items = req.session.UserProfile[0].Items;
        let flag=0;

        for(let i = 0; i < Items.length; i++){
            if(Items[i].Item_Code == Item_Code_reqd){
                flag = 1;
            }
        }

        if(flag==0){
          console.log( "*****Please save the item to your profile to save your feedback*****");
          var query1 = itemDb.getItem(Item_Code_reqd);
          var promise1=query1.exec();
          promise1.then(function(doc){
              if(doc.length!=0){
                  var Item = doc;
                  res.render('item',{data:Item,signin_info: req.session.signin_info,signinout:req.session.signinout});
              }
            });
        }
else if (flag==1){

        var query1 = itemDb.getItem(Item_Code_reqd);
        var promise1 = query1.exec();
        promise1.then(function(doc){
            if(doc.length!=0){
                var Item = doc;

                res.render('feedback',{Items:Items,data:Item,signin_info: req.session.signin_info,signinout:req.session.signinout});
              }

            else{
                var query2=itemDb.categories();
                var promise2 = query2.exec();

                promise2.then(function (doc) {
                    Category = doc;
                    var query3 = itemDb.getItems();
                    var promise3 = query3.exec();
                    promise3.then(function(doc){
                        Items=doc;
                        res.render('categories',{Items:Items,Category:Category,signin_info: req.session.signin_info,signinout:req.session.signinout});
                    });
                });
            }
        });
}
}
}
  });



//------------------------------------------------FEEDBACK POST ----------------------------------------------------------
/*
app.post('/feedback/:Item_Code',urlencodedParser, function(req, res){

      if(req.session.theUser==undefined){
        req.session.signin_info = "Not Signed in";
        req.session.signinout = "Sign_in";
        var info = "******Please Sign in to save your feedback******";
        res.render('login',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});

      }
      else{
   var rating=req.body.rating;

   var Item_Code = req.params.Item_Code;
   var x= "";
    x = Number(Item_Code_reqd,10);
   console.log("hiii"+ x);


   if(isNaN(x)){
       console.log("hellooo");
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

 var Item = itemDb.getItem(Item_Code);
   Item.Rating = rating;

        var data={
            Item_Code:Item.Item_Code,
            Item_Name:Item.Item_Name,
            Catalog_Category:Item.Catalog_Category,
            Description:Item.Description,
            Rating:Item.Rating,
            GetImageURL:Item.GetImageURL,
            Tried_it:Item.Tried_it,
        }
      }
      profile=req.session.UserProfile[0];
      res.render('myitems',{profile:profile,data:data,signin_info: req.session.signin_info,signinout:req.session.signinout});
}
});


*/

//----------------------------------------SIGN OUT PAGE-------------------------------------------------------------------

/*
app.get('/Sign_out',function(req,res){
    req.session.theUser = undefined;
    req.session.UserProfile = undefined;

    req.session.signin_info="Not Signed in";
    req.session.signinout="Sign_in";

    res.render('index',{signin_info: req.session.signin_info,signinout:req.session.signinout});
});
*/

//--------------------------------------------CONTACT PAGE------------------------------------------------------------------


app.get('/contact',function(req, res){

	if(req.url == '/' || req.url == '/contact')
      res.render('contact',{signin_info: req.session.signin_info,signinout:req.session.signinout});
});



//------------------------------------------------ABOUT PAGE---------------------------------------------------------------------



app.get('/about',function(req, res){
	   if(req.url == '/' || req.url == '/about')
            res.render('about',{signin_info: req.session.signin_info,signinout:req.session.signinout});
});



//----------------------------------------------GET SIGN IN--------------------------------------------------------------------------------------


/*
app.get('/sign_in',function(req, res){

  var info ="Welcome to our site !!!";
  res.render('sign_in',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});

});
*/



//----------------------------------------------POST SIGN IN--------------------------------------------------------------------------------------
/*

app.post('/sign_in',urlencodedParser, function(req, res){

      var email_reqd = req.body.email;
      var password_reqd = req.body.pswd;

      if (email_reqd == '' || password_reqd == ''){
          console.log("Both Username and password are required");

          req.session.signin_info = "Not Signed in";
          req.session.signinout = "Sign_in";

          var info= "*****Both Username and password are required*****";
          res.render('sign_in',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});
      }

      else{
          var query = UserDB.getUser_by_email(email_reqd);

          var promise = query.exec();
          promise.then(function(doc){
            var user_ID_reqd = doc[0].User_ID;
              if(doc.length==0){
                  console.log("Incorrect Username ");
                  req.session.signin_info = "Not Signed in";
                  req.session.signinout = "Sign_in";
                  var info = "******Incorrect Username******";
                  res.render('sign_in',{info:info,signin_info: req.session.signin_info,signinout:req.session.signinout});
              }

              else if(doc[0].Password == password_reqd){

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
                          console.log("profile "+profile);

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

                  res.render('sign_in',{info:info, signin_info: req.session.signin_info,signinout:req.session.signinout});
              }
          });
      }
});


*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/*',function(req, res){

	res.render('index',{signin_info: req.session.signin_info,signinout:req.session.signinout});

});
