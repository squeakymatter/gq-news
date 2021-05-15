const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SALT_I = 10;

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
  name: {
    type: String,
    maxlength: 100,
  },
  lastname: {
    type: String,
    maxlength: 100,
  },
  token: {
    type: String,
  },
});

//get user, but before save, pre-save, generate password, grab it and hash it.
//do something before save, then run callback function with next method
userSchema.pre('save', function (next) {
  var user = this; //this = user we are trying to save
  //if existing user trying to updating password, then hash password
  if (user.isModified('password')) {
    //call genSalt method to generate hash, then run callback function. if no error, then get salt value.
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err); //if error, return error
      //if no error, hash the password, then run another callback function to return hash if there's no error.
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        //if no error, change current password for that hash.
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//use userSchema.methods to create method to generate token
userSchema.methods.generateToken = async function () {
  var user = this; //store user for later use
  // sign method to create tokens with 3 arguments: what we want to create a token for (email), secret PW to generate token, expiration date
  var token = jwt.sign({ email: user.email }, process.env.SECRET, {
    expiresIn: '7d',
  });

  //pass token to user:
  user.token = token;
  return user.save(); // save user
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
