var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({  
  name: {
      type:String,
      required: true
  },
  email: {
      type: String,
      required: true
  },
  userRole:{
      type: String,
      default: "user"
  },
  timeStamp:{
      type: Date,
      default: Date.now()
  }
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');