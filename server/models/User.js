const mongoose = require('mongoose');
const validator = require('validator'); //validates emails so you don't have to use regEx...

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  firstName: {
    type: String,
    maxlength: 100,
  },
  lastName: {
    type: String,
    maxlength: 100,
  },
  token: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
