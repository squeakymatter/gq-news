const { User } = require('../../models/User');
const authorize = require('../../../utils/isAuth');
const { AuthenticationError } = require('apollo-server-express');
module.exports = {
  Query: {
    user: async (parent, args, context, info) => {
      try {
        // create middleware to access request and try to find token.
        const req = authorize(context.req);

        //get user by id
        const user = await User.findOne({ _id: args.id });

        //wrong user
        if (req._id.toString() !== user._id.toString()) {
          throw new AuthenticationError('Incorrect user');
        }

        return user;
      } catch (err) {
        throw err;
      }
    },
    isAuth: async (parent, args, context, info) => {
      try {
        //make sure user is authenticated
        const req = authorize(context.req, true);
        if (!req._id) {
          throw new AuthenticationError('Bad token');
        }
        //this info will be used on front end
        return { _id: req._id, email: req.email, token: req.token };
      } catch (err) {
        throw err;
      }
    },
  },
};
