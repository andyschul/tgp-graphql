const uuidv1 = require('uuid/v1');

const resolvers = {
  Query: {
    hello: async () => {
      return 'Hello world'
    },
    async user(_, __, {user}) {
      return user
    },
    async schedule(_, __, { dataSources }) {
      const schedule = await dataSources.sportsAPI.getSchedule('2019')
      return schedule.tournaments;
    },
    async groups(_, __, { dataSources }) {
      const params = {
        TableName: "GolfPool",
        Key: {
          id: decoded.payload.sub
        }
      }
      const data = await dataSources.userAPI.get(params);
      const schedule = await dataSources.userAPI.get()
      return schedule.tournaments;
    }
  },
  Mutation: {
    createGroup: async (_, args, context) => {
      const groupId = uuidv1()
      const params = {
        RequestItems: {
          'GolfPool': [
            {
              PutRequest: {
                Item: {
                  'id': `Group-${groupId}`,
                  'type': `Group-${groupId}`,
                  'name': args.name,
                  'seasons': [2019],
                  'owner': context.user.id
                }
              }
            },
            {
              PutRequest: {
                Item: {
                  'id': context.user.id,
                  'type': `Group-${groupId}`,
                  'role': 'owner',
                  'name': args.name,
                }
              }
            },
            {
              PutRequest: {
                Item: {
                  'id': `Group-${groupId}`,
                  'type': context.user.id,
                  'name': 'Team A',
                }
              }
            }
          ]
        }
      }
      try {
        let group = await context.dataSources.userAPI.batchWrite(params);
      }
      catch (err) {
        console.log("Error", err)
      }
      return group.Attributes;
    },
    updateUser: async (_, args, context) => {
      const params = {
        TableName:"GolfPool",
        Key:{
            "id": context.user.id,
            "type": context.user.id
        },
        UpdateExpression: "set firstName = :f, lastName=:l",
        ExpressionAttributeValues:{
            ":f": args.firstName,
            ":l": args.lastName
        },
        ReturnValues:"UPDATED_NEW"
      }
      let user = await context.dataSources.userAPI.update(params);
      return user.Attributes;
    }
  },
  User: {
    async email(parent, args, context, info) {
      return parent.email
    }
  },
};


module.exports = resolvers;