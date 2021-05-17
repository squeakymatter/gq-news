const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

//graphql
const typeDefs = require('./graphql/schema');
const { Query } = require('./graphql/resolvers/query');
const { Mutation } = require('./graphql/resolvers/mutation');
const { User } = require('./graphql/resolvers/user');
const { Post } = require('./graphql/resolvers/post');
const { Category } = require('./graphql/resolvers/category');

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Category,
  },
  context: ({ req }) => {
    req.headers.authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDlmNDUwYTI3MTIxODBiYTNkM2UyYjciLCJlbWFpbCI6ImZvb2JhcnJpb0Bmb29iYXIuY29tIiwiaWF0IjoxNjIxMjI1NjcxLCJleHAiOjE2MjE4MzA0NzF9.SueBrx4XPdeTpp8NiIRnsAYUxf_ON3u4gscAQVEiKT8';

    return { req };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5001;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.lkxwy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
