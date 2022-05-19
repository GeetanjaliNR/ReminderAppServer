//importing mongoose
const mongoose = require('mongoose');

//connection string
mongoose.connect('mongodb://localhost:27017/reminderServer', {
  useNewUrlParser: true,
});

//creating database model
const User = mongoose.model('User', {
  username: String,
  userid: String,
  password: String,
  reminderevent: [],
});

//export module
module.exports = {
  User,
};
