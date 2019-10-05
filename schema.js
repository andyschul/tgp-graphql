const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    user: User
  }
  type User {
    email: String!
    firstName: String!
    lastName: String!
  }
  type Mutation {
    updateUser(firstName: String, lastName: String): MutationResponse
  }
  type MutationResponse {
    firstName: String
    lastName: String
  }
`;

module.exports = typeDefs;