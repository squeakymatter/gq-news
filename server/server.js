const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

//graphql
const typeDefs = require('./graphql/schema');
const { Query } = require('./graphql/resolvers/query');

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    //mutations
    //user,etc.
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
