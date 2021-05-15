//bring in user from User model from mongooose
const { User } = require('../../models/User');
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require('apollo-server-express');

module.exports = {
  Mutation: {
    authUser: async (parent, args, context, info) => {
      return true;
    },
    signUp: async (parent, args, context, info) => {
      try {
        //create new user on db... not doing validation on the actual request--it comes from mongoose from the actual user.
        const user = new User({
          email: args.fields.email,
          password: args.fields.password,
        });

        const getToken = await user.generateToken();
        if (!getToken) {
          throw new AuthenticationError(
            'Something went wrong. Please try again.'
          );
        }
        return { ...getToken._doc };
      } catch (err) {
        // E11000 is the default MongoDB error for duplicate user
        if (err.code === 11000) {
          throw new AuthenticationError(
            'This email address is already in use.'
          );
        }
        throw err;
      }
    },
  },
};

//validate user has correct token
//adding posts - make sure user has correct token
