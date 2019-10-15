const uuidv1 = require('uuid/v1');

const resolvers = {
  Query: {
    hello: async () => {
      return 'Hello world'
    },
    async user(_, __, context) {
      const params = {
        TableName: "GolfPool",
        IndexName: "type-data-index",
        KeyConditionExpression:"#type = :typeValue and begins_with(#data, :dataValue)",
        ExpressionAttributeNames: {
            "#type":"type",
            "#data":"data"
        },
        ExpressionAttributeValues: {
            ":typeValue": 'User-1677e7c2-28d4-4fbe-99b4-12f5b70946ca',
            ":dataValue": 'Group-'
        }
      }
      let groups = await context.dataSources.userAPI.query(params)
      return {
        ...context.user,
        groups: groups.Items
      }
    },
    async group(_, args, context) {
      const params = {
        TableName: "GolfPool",
        KeyConditionExpression:"#id = :idValue",
        ExpressionAttributeNames: {
            "#id":"id",
        },
        ExpressionAttributeValues: {
            ":idValue": args.id,
        }
      }
      let {Items} = await context.dataSources.userAPI.query(params);
      let group = Items.shift()
      group.users = Items
      return group;
    },
    async schedule(_, __, { dataSources }) {
      const schedule = await dataSources.sportsAPI.getSchedule('2019')
      return schedule.tournaments;
    },
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
                  'groupName': args.name,
                  'seasons': [2019],
                  'owner': context.user.id
                }
              }
            },
            {
              PutRequest: {
                Item: {
                  'id': `Group-${groupId}`,
                  'type': context.user.id,
                  'firstName': context.user.firstName,
                  'lastName': context.user.lastName,
                  'teamName': 'Team A',
                  'role': 'owner',
                  'groupName': args.name,
                  'data': `Group-${groupId}`
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