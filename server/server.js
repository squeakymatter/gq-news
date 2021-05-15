const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

//graphql
const typeDefs = require('./graphql/schema');
const { Query } = require('./graphql/resolvers/query');
const { Mutation } = require('./graphql/resolvers/mutation');

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: ({ req }) => {
    req.headers.authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDlmNDUwYTI3MTIxODBiYTNkM2UyYjciLCJlbWFpbCI6ImZvb0BiYXIudGVzdCIsImlhdCI6MTYyMTA1MDYzNCwiZXhwIjoxNjIxNjU1NDM0fQ.6wlrebIhsG9LHe2l-4lciQK8hqrsyFy6dBxyPYb-MAU';
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
