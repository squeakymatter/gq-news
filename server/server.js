const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const db = require('./connection');

/// graphql
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
    return { req };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

//for heroku!
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
