const { ApolloServer } = require('apollo-server-lambda');
const User = require('./models/user');
const UserAPI = require('./datasources/user');
const SportsAPI = require('./datasources/sports');
const typeDefs = require('./schema');
const jwt = require('jsonwebtoken');
// const jwksRsa = require('jwks-rsa');
const resolvers = require('./resolvers');



const context = async (req) => {
  let token = req.event.headers.authorization;
  const decoded = jwt.decode(token, {complete:true})
  const id = decoded.payload.sub.split('|')[1];
  const user = await User.findOne({ _id: id });
  // TODO: verify token
  return {user: user}
};

const dataSources = () => ({
  userAPI: new UserAPI({ User }),
  sportsAPI: new SportsAPI({ User }),
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
