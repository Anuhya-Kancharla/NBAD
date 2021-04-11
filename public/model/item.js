var item = function(Item_Code, Item_Name, Catalog_Category, Description, Rating, GetImageURL, Tried_it){
  this.Item_Code = Item_Code;
  this.Item_Name = Item_Name;
  this.Catalog_Category = Catalog_Category;
  this.Description = Description;
  this.Rating = Rating;
  this.GetImageURL=GetImageURL;
  this.Tried_it = Tried_it;

};

module.exports= item;
