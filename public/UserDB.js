var User = require('./model/User.js');
var UserProfile = require('./model/UserProfile.js');
var Item = require('./model/item.js');
var UserItem = require('./model/UserItem.js');
var itemDB = require('./itemDB.js');
let Users=[];
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/florist', { useNewUrlParser: true });
var Schema = mongoose.Schema;


var usersSchema = new Schema ({
      User_ID:String,
      Password:String,
      First_Name:String,
      Last_Name:String,
      Email_Address:String,
      Address1:String,
      Address2:String,
      City:String,
      State:String,
      Zip_Code:Number,
      Country:String,
});

var users = mongoose.model('users', usersSchema);


var userItemSchema = new Schema({
  Item_Code:String,
  Rating:Number,
  Tried_it:String,
});
var userItem = mongoose.model('UserITem',userItemSchema);


var profilesSchema = new Schema({
  User_ID:String,
  Items:[
          { Item_Code:String,
            Rating:Number,
            Tried_it:String,
          }
        ],
});
var profiles = mongoose.model('profiles', profilesSchema);


var All_Items = [];
All_Items = itemDB.getItems();



module.exports.getUsers=function(){
    var query = users.find();
    return query;
};


module.exports.addUser=function(User_ID, password,First_Name, Last_Name, Email_Address, Address1, Address2, City, State, Zip_Code, Country){
    var user= new users({
                              User_ID:User_ID,
                              Password:password,
                              First_Name:First_Name,
                              Last_Name:Last_Name,
                              Email_Address:Email_Address,
                              Address1:Address1,
                              Address2:Address2,
                              City:City,
                              State:State,
                              Zip_Code:Zip_Code,
                              Country:Country});
        user.save(function (err, customer) {
            if (err) return console.error(err);
               console.log(customer.First_Name + " saved to collection.");
            });

    var profile = new profiles({
      User_ID:User_ID,
      Items:[]
    });
    profile.save(function (err, customer) {
        if (err) return console.error(err);
           console.log(customer.First_Name + " saved to collection.");
        });

};

module.exports.getUser = function (User_ID) {
    var User_ID_reqd = User_ID;
    var query = users.find({User_ID:User_ID_reqd});
    return query;
};


module.exports.getUser_by_email = function (email) {
    var email_reqd = email;
    var query = users.find({Email_Address:email_reqd});
    return query;
};


module.exports.getUserProfile = function(User_ID){
    var User_ID_reqd = User_ID;
    var query = profiles.find({User_ID:User_ID_reqd});
    return query;
};


module.exports.addItem = function(User_ID, Item_Code){
    var User_ID_reqd = User_ID;
    var Item_Code_reqd = Item_Code;

    var query = itemDB.getItems();
    var promise = query.exec();
    promise.then(function(doc){
      var All_Items = doc;


      profiles.find({User_ID:User_ID_reqd}, function(err,result){
        var flag1=0;
      //  console.log(result);

        for(i=0; i<All_Items.length; i++){
            if(All_Items[i].Item_Code == Item_Code_reqd)
                flag1 = 1;
        }

        if(flag1 == 1){
            var flag2 = 0;
            var Items = result[0].Items;
            for(let i = 0; i < Items.length; i++){
                if(Items[i].Item_Code == Item_Code_reqd){
                    console.log("Item already exists in your profile");
                    flag2 = 1;
                }
            }

        if(flag2==0){
            profiles.findOne({User_ID:User_ID_reqd},function(err,result){
            if (err)console.log(err);
                result.Items.push({
                    Item_Code:Item_Code_reqd,
                    Rating:1,
                    Tried_it:"No",
                });

                result.save();
            });
        }
    }

    if(flag1==0)
          console.log("Requested Item does not exist");;

    });
});
};



module.exports.DeleteItem = function(User_ID, Item_Code){
    var User_ID_reqd = User_ID;
    var Item_Code_reqd = Item_Code;

    profiles.find({User_ID:User_ID_reqd,'Items.Item_Code':Item_Code_reqd}, function(err,result){
        if(err) console.log(err);

        if(result.length == 0)
          console.log("Item doesn't exist in your profile");


        else{
          //console.log(User_ID_reqd, Item_Code_reqd);
          profiles.update(
              { User_ID:User_ID_reqd },
              { $pull: { Items : { Item_Code:Item_Code_reqd } } },
              { safe: true },
              function (err, obj) {
                  console.log(obj);
              });
        }
      });
};



module.exports.addItemRating = function(Item_Code, User_ID, Rating){
    var Item_Code_reqd = Item_Code;
    var User_ID_reqd = User_ID;
    var New_Rating = Rating;

    profiles.findOne({User_ID:User_ID_reqd}, function(err,result){
        if(err) console.log(err);

        for(let i=0; i < result.Items.length; i++){
            if(result.Items[i].Item_Code == Item_Code_reqd){
                result.Items[i].Rating = New_Rating;
            }
        }
        result.save();
    });
};



module.exports.addTriedIt = function(Item_Code, User_ID, Triedit){
    var Item_Code_reqd = Item_Code;
    var User_ID_reqd = User_ID;
    var New_Triedit = Triedit;

    profiles.findOne({User_ID:User_ID_reqd}, function(err,result){
          if(err) console.log(err);

          for(let i=0; i < result.Items.length; i++){
              if(result.Items[i].Item_Code == Item_Code_reqd){
                  result.Items[i].Tried_it = New_Triedit;
                }
          }
          result.save();
    });
};
