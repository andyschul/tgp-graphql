const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    user: User
    schedule: [Tournament!]!
    group(id: ID!): Group
  }
  type Group {
    id: ID!
    groupName: String
    owner: String
    users: [GroupUser]
  }
  type GroupUser {
    firstName: String!
    lastName: String!
  }
  type User {
    email: String!
    firstName: String!
    lastName: String!
    groups: [UserGroup]
  }
  type Tournament {
    id: String!
    name: String!
  }
  type UserGroup {
    id: ID!
    groupName: String!
    role: String
    teamName: String
    users: [GroupUser]
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