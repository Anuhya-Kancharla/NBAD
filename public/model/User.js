var User = function(User_ID, password,First_Name, Last_Name, Email_Address, Address1, Address2, City, State, Zip_Code, Country){
  this.User_ID = User_ID;
  this.password = password;
  this.First_Name = First_Name;
  this.Last_Name = Last_Name;
  this.Email_Address = Email_Address;
  this.Address1 = Address1;
  this.Address2 = Address2;
  this.City = City;
  this.State = State;
  this.Zip_Code = Zip_Code;
  this.Country = Country;

};

module.exports= User;
