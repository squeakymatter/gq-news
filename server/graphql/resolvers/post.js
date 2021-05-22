const { Post } = require('../../models/Post');
const { Category } = require('../../models/Category');
const { User } = require('../../models/User');
const { sortArgsHelper } = require('../../utils/tools');

module.exports = {
  Post: {
    author: async (parent, args, context, info) => {
      try {
        const userId = parent.author;
        const user = await User.findOne({ _id: userId });
        return {
          ...user._doc,
          password: null, //don't return password
        };
      } catch (err) {
        throw err;
      }
    },
    category: async (parent, args, context, info) => {
      try {
        const categoryId = parent.category;
        const category = await Category.findById({ _id: categoryId });

        return {
          ...category._doc,
        };
      } catch (err) {
        throw err;
      }
    },
    related: async (parent, { sort }, context, info) => {
      try {
        let sortArgs = sortArgsHelper(sort);

        //go to posts and get related posts
        const posts = await Post.find({ category: parent.category })
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
