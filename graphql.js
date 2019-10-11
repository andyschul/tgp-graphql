const { ApolloServer } = require('apollo-server-lambda');
const UserAPI = require('./datasources/user');
const SportsAPI = require('./datasources/sports');
const typeDefs = require('./schema');
const jwt = require('jsonwebtoken');
// const jwksRsa = require('jwks-rsa');
const resolvers = require('./resolvers');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const context = async (req) => {
  let token = req.event.headers.authorization;
  const decoded = jwt.decode(token, {complete:true})
  // TODO: verify token

  const params = {
    TableName: "GolfPool",
    Key: {
      id: `User-${decoded.payload.sub}`,
      type: `User-${decoded.payload.sub}`
    }
  }
  const data = await docClient.get(params).promise();
  return {user: data.Item}
};

const dataSources = () => ({
  userAPI: new UserAPI(),
  sportsAPI: new SportsAPI(),
});

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources,
  context
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
