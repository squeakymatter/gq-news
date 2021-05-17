const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    isAuth: User!
    categories(catId: ID): [Category]!
    post(id: ID!): Post!
    posts(sort: SortInput, queryBy: QueryByInput): [Post!]!
  }

  type Mutation {
    updateUserEmailPassword(email: String!, password: String, _id: ID!): User!
    updateUserProfile(firstName: String, lastName: String, _id: ID!): User!
    authUser(fields: AuthInput!): User!
    signUp(fields: AuthInput!): User!
    createPost(fields: PostInput!): Post!
    updatePost(fields: PostInput!, postId: ID!): Post!
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
    related(sort: SortInput): [Post!]
  }

  type User {
    _id: ID!
    email: String!
    password: String
    firstName: String
    lastName: String
    token: String
    posts(sort: SortInput): [Post!]!
    categories: [Category!]!
  }

  type Category {
    _id: ID!
    name: String!
    author: User!
    posts: [Post]
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

  input SortInput {
    sortBy: String
    order: String
    limit: Int
    skip: Int
  }

  input QueryByInput {
    key: String!
    value: String!
  }

  enum PostStatus {
    PUBLIC
    DRAFT
  }
`;

module.exports = typeDefs;
