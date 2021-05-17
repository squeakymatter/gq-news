const { Post } = require('../../models/Post');
const { User } = require('../../models/User');
// const post = require('../../models/post');

module.exports = {
  Category: {
    posts: async (parent, args, context, info) => {
      try {
        const categoryId = parent._id;
        const posts = await Post.find({ category: categoryId });

        return posts;
      } catch (err) {
        throw err;
      }
    },
    author: async (parent, args, context, info) => {
      try {
        const authorId = parent.author;
        const user = await User.findOne({ _id: authorId });
        return {
          ...user._doc,
          password: null,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
