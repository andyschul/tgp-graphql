const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    user: User
    schedule(year: String): [ScheduleTournament!]!
    group(id: ID!): Group
    tournament(id: ID!, groupId: ID): Tournament
  }
  type Group {
    id: ID!
    groupName: String
    owner: String
    invites: [String!]
    users: [GroupUser]
  }
  type GroupUser {
    firstName: String
    lastName: String
    role: String!
  }
  type User {
    email: String!
    firstName: String
    lastName: String
    groups: [UserGroup]
  }
  type Tournament {
    id: ID
    name: String
    startDate: String
    endDate: String
    purse: Int
    winningShare: Int
    venue: Venue
    groups: [TournamentGroup]
    leaderboard: [LeaderboardPlayer]
  }
  type TournamentGroup {
    id: ID
    players: [TournamentPlayer]
  }
  type LeaderboardPlayer {
    id: ID
    firstName: String
    lastName: String
    country: String
    status: String
    money: Int
    position: Int
    score: Int
    strokes: Int
    tied: Boolean
  }
  type TournamentPlayer {
    id: ID
    firstName: String
    lastName: String
    country: String
    isSelected: Boolean
  }
  type Venue {
    id: String
    name: String
  }
  type ScheduleTournament {
    id: String!
    name: String!
    startDate: String
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
    joinGroup(groupId: ID!, name: String): joinGroupResponse
    inviteToGroup(groupId: ID!, email: String): inviteResponse
    updatePicks(groupId: ID!, tournamentId: ID!, picks: [String]): updatePicksResponse
  }
  type updateUserResponse {
    firstName: String
    lastName: String
  }
  type updatePicksResponse {
    success: Boolean
  }
  type joinGroupResponse {
    msg: String
  }
  type createGroupResponse {
    name: String
  }
  type inviteResponse {
    email: String
  }
`;

module.exports = typeDefs;