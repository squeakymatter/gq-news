//bring in user from User model from mongoose
const { User } = require('../../models/User');
const { Post } = require('../../models/Post');
const { Category } = require('../../models/Category');
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require('apollo-server-express');
const authorize = require('../../utils/isAuth');
const { userOwnership } = require('../../utils/tools');
const post = require('./post');
const category = require('./category');

module.exports = {
  Mutation: {
    authUser: async (parent, args, context, info) => {
      try {
        //check that email address is correct
        const user = await User.findOne({
          email: args.fields.email,
        });
        //throw authentication error if email not recognized
        if (!user) {
          throw new AuthenticationError(
            'Your email address is not recognized.'
          );
        }
        //check if password is correct
        const checkPassword = await user.comparePassword(args.fields.password);
        //throw error if password is incorrect
        if (!checkPassword) {
          throw new AuthenticationError('Your email or password is incorrect.');
        }
        //login successful - generate token
        const getToken = await user.generateToken();

        //return user with new token
        return {
          _id: user.id,
          email: user.email,
          token: getToken.token,
        };
      } catch (err) {
        throw err;
      }
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
        throw new ApolloError(
          'Something went wrong. Please try again.',
          null,
          err
        );
      }
    },
    updateUserProfile: async (parent, args, context, info) => {
      try {
        //check if user is authorized/has good token
        const req = authorize(context.req);
        //if token is correct, make sure user owns what they're trying to modify
        //get id that user is trying to modify through he args, and the id from the token and if user is incorrect, throw error.
        if (!userOwnership(req, args._id))
          throw new AuthenticationError('Incorrect user');
        // to do: validate fields

        const user = await User.findOneAndUpdate(
          { _id: args._id },
          {
            $set: {
              firstName: args.firstName,
              lastName: args.lastName,
            },
          },
          { new: true }
        );
        return { ...user._doc };
      } catch (err) {
        throw err;
      }
    },
    updateUserEmailPassword: async (parent, args, context, info) => {
      try {
        const req = authorize(context.req);

        if (!userOwnership(req, args._id))
          throw new AuthenticationError(
            'You are not authorized to perform this action.'
          );

        const user = await User.findOne({ _id: req._id });
        if (!user)
          throw new AuthenticationError(
            'You are not authorized to perform this action.'
          );

        // TODO: validate fields

        if (args.email) {
          user.email = args.email;
        }
        if (args.password) {
          user.password = args.password;
        }

        /// If correct user, generate token
        const getToken = await user.generateToken();
        if (!getToken) {
          throw new AuthenticationError('Something went wrong, try again');
        }
        return { ...getToken._doc, token: getToken.token };
      } catch (err) {
        throw new ApolloError('Something went wrong, try again', err);
      }
    },
    createPost: async (parent, { fields }, context, info) => {
      try {
        //verify user is authorized
        const req = authorize(context.req);
        //todo: validation
        const post = new Post({
          title: fields.title,
          excerpt: fields.excerpt,
          content: fields.content,
          author: req._id,
          status: fields.status,
          category: fields.category,
        });
        const result = await post.save();
        return { ...result._doc };
      } catch (err) {
        throw err;
      }
    },
    createCategory: async (parent, args, context, info) => {
      try {
        //verify user is authorized
        const req = authorize(context.req);
        //todo: validation
        const category = new Category({
          author: req._id,
          name: args.name,
        });
        const result = await category.save();
        return { ...result._doc };
      } catch (err) {
        throw err;
      }
    },
    updatePost: async (parent, { fields, postId }, context, info) => {
      try {
        const req = authorize(context.req);
        const post = await Post.findOne({ _id: postId });

        if (!post) {
          throw new UserInputError('Post does not exist!');
        }

        if (!userOwnership(req, post.author))
          throw new AuthenticationError(
            'You are not authorized to perform this action'
          );

        for (key in fields) {
          if (post[key] != fields[key]) {
            post[key] = fields[key];
          }
        }

        const result = await post.save();
        return { ...result._doc };
      } catch (err) {
        throw err;
      }
    },
    deletePost: async (parent, { postId }, context, info) => {
      try {
        const req = authorize(context.req);
        const post = await Post.findOne({ _id: postId });
        if (!post) {
          throw new UserInputError('This post does not exist.');
        }
        if (!userOwnership(req, post.author)) {
          throw new AuthenticationError(
            'You are not authorized to perform this action.'
          );
        }
        const result = await post.remove();
        return result;
      } catch (error) {
        throw error;
      }
    },
    updateCategory: async (parent, { catId, name }, context, info) => {
      try {
        const req = authorize(context.req);
        const category = await Category.findOneAndUpdate(
          { _id: catId },
          {
            $set: {
              name,
            },
          },
          { new: true }
        );
        /// throw..
        return { ...category._doc };
      } catch (err) {
        throw err;
      }
    },
    deleteCategory: async (parent, { catId }, context, info) => {
      try {
        const req = authorize(context.req);
        const category = await Category.findByIdAndRemove(catId);
        if (!category) throw new UserInputError('Category does not exist.');

        return category;
      } catch (err) {
        throw err;
      }
    },
  },
};
