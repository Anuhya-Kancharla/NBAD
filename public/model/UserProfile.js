var itemDB=require("../itemDB.js");

var UserProfile = function(User_ID , Items){
  this.User_ID = User_ID;
  this.Items = Items;
};


module.exports = UserProfile;
