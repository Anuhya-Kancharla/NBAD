var Item = require('./model/item');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/florist', { useNewUrlParser: true });
var Schema = mongoose.Schema;


var categoriesSchema = new Schema ({
      name:String,
});
var categories = mongoose.model('categories', categoriesSchema);


var itemsSchema = new Schema ({
    Item_Code:String,
    Item_Name:String,
    Catalog_Category:String,
    Description: String,
    Rating:Number,
    GetImageURL:String,
    User_ID:String,
});
var items =  mongoose.model('items', itemsSchema);



module.exports.additem=function(Item_Code, Item_Name, Catalog_Category, Description, Rating, GetImageURL,User_ID){
    var new_item= new items({
                            Item_Code:Item_Code,
                            Item_Name:Item_Name,
                            Catalog_Category:Catalog_Category,
                            Description:Description,
                            Rating:Rating,
                            GetImageURL:GetImageURL,
                            User_ID:User_ID
                          });
        new_item.save(function (err, item) {
            if (err) return console.error(err);
               console.log(item.Item_Name + " saved to collection.");
            });
  };
module.exports.getItem = function (Item_Code) {
  var Item_Code_reqd = Item_Code;

      var Item=[];

    var query = items.find({Item_Code:Item_Code_reqd});
    return query;
};



module.exports.getItems = function () {

    var query=items.find();
    return query;
};



module.exports.categories = function () {
     var query = categories.find();
     return query;
};
