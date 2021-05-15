const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError } = require('apollo-server-express');

const throwAuthError = () => {
  throw new AuthenticationError('Not authorized.');
};

const authorize = (req, verify = false) => {
  //get authorization
  const authorizationHeader = req.headers.authorization || '';
  if (!authorizationHeader) {
    //false by default
    req.isAuth = false;
    //if verify is false, throw an error. if not, grab request and modify it
    return !verify ? throwAuthError() : req;
    throw new AuthenticationError('Not authorized.');
  }

  const token = authorizationHeader.replace('Bearer ', '');
  if (!token || token === '') {
    req.isAuth = false;
    return !verify ? throwAuthError() : req;
  }

  //if token and authorization header exist, validate token:
  let decodedJWT;
  try {
    //grab token and try to verify using SECRET
    decodedJWT = jwt.verify(token, process.env.SECRET);
    if (!decodedJWT) {
      return !verify ? throwAuthError() : req;
    }
    req.isAuth = true;
    //do tokens match?
    req._id = decodedJWT._id;
    req.email = decodedJWT.email;
    req.token = token;
    return req;
  } catch (err) {
    req.isAuth = false;
    return !verify ? throwAuthError() : req;
  }
};

module.exports = authorize;
