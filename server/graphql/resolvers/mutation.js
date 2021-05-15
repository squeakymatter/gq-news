//bring in user from User model from mongooose
const { User } = require('../../models/User');

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
          throw new AuthenticationError('Something went wrong, try again');
        }
        return { ...getToken._doc };
      } catch (err) {
        if (err.code === 11000) {
          throw new AuthenticationError('Sorry, duplicated email.');
        }
        throw err;
      }
    },
  },
};
