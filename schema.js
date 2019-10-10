const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    user: User
    schedule: [Tournament!]!
  }
  type User {
    email: String!
    firstName: String!
    lastName: String!
  }
  type Tournament {
    id: String!
    name: String!
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