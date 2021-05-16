const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    isAuth: User!
  }

  type Mutation {
    updateUserEmailPassword(email: String!, password: String, _id: ID!): User!
    updateUserProfile(firstName: String, lastName: String, _id: ID!): User!
    authUser(fields: AuthInput!): User!
    signUp(fields: AuthInput!): User!
    createPost(fields: PostInput!): Post!
    createCategory(name: String!): Category!
  }

  type Post {
    _id: ID!
    title: String!
    excerpt: String!
    content: String!
    created_at: String
    updated_at: String
    status: PostStatus
    author: User!
    category: Category!
  }

  type Category {
    _id: ID!
    name: String!
    author: User!
    posts: [Post]
  }

  type User {
    _id: ID!
    email: String!
    password: String
    firstName: String
    lastName: String
    token: String
    posts: [Post!]!
    categories: [Category!]!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String
    excerpt: String
    content: String
    status: PostStatus
    category: ID
  }

  enum PostStatus {
    PUBLIC
    DRAFT
  }
`;

module.exports = typeDefs;
