const { User } = require('../../models/User');
const { Category } = require('../../models/Category');
const { Post } = require('../../models/Post');
const authorize = require('../../utils/isAuth');
const { sortArgsHelper } = require('../../utils/tools');
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
    categories: async (parent, { catId }, context, info) => {
      try {
        let catQuery = {};
        if (catId) {
          catQuery['_id'] = catId;
        }

        const categories = await Category.find(catQuery);
        return categories;
      } catch (err) {
        throw err;
      }
    },
    post: async (parent, args, context, info) => {
      try {
        const post = await Post.findOne({ _id: args.id });
        return post;
      } catch (err) {
        throw err;
      }
    },
    posts: async (parent, { sort, queryBy }, context, info) => {
      try {
        let queryByArgs = {};
        let sortArgs = sortArgsHelper(sort);

        if (queryBy) {
          queryByArgs[queryBy.key] = queryBy.value;
        }
        const posts = await Post.find(queryByArgs)
          .sort([[sortArgs.sortBy, sortArgs.order]])
          .skip(sortArgs.skip)
          .limit(sortArgs.limit);

        return posts;
      } catch (err) {
        throw err;
      }
    },
  },
};
