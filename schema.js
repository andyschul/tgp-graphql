const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    user: User
    schedule: [Tournament!]!
    groups: [Group]
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
  type Group {
    id: String!
    name: String!
  }
  type Mutation {
    updateUser(firstName: String, lastName: String): updateUserResponse
    createGroup(name: String): createGroupResponse
  }
  type updateUserResponse {
    firstName: String
    lastName: String
  }
  type createGroupResponse {
    name: String
  }
`;

module.exports = typeDefs;