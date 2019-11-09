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
            ":typeValue": context.user.id,
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
      const groupId = `Group-${uuidv1()}`
      const params = {
        RequestItems: {
          'GolfPool': [
            {
              PutRequest: {
                Item: {
                  'id': groupId,
                  'type': groupId,
                  'groupName': args.name,
                  'seasons': [2019],
                  'invites': [],
                  'owner': context.user.id
                }
              }
            },
            {
              PutRequest: {
                Item: {
                  'id': groupId,
                  'type': context.user.id,
                  'firstName': context.user.firstName,
                  'lastName': context.user.lastName,
                  'teamName': `Team ${context.user.lastName}`,
                  'role': 'owner',
                  'groupName': args.name,
                  'data': groupId
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
    joinGroup: async (_, args, context) => {
      const groupParams = {
        TableName: "GolfPool",
        Key: {
          id: args.groupId,
          type: args.groupId
        }
      }
      let group = await context.dataSources.userAPI.get(groupParams);

      if (!group.Item.invites.includes(context.user.email)) {
        return {msg: 'Not invited'}
      }
      group.Item.invites = group.Item.invites.filter(email => email !== context.user.email)
      const params = {
        RequestItems: {
          'GolfPool': [
            {
              PutRequest: {
                Item: group.Item
              }
            },
            {
              PutRequest: {
                Item: {
                  'id': args.groupId,
                  'type': context.user.id,
                  'firstName': context.user.firstName,
                  'lastName': context.user.lastName,
                  'teamName': args.name,
                  'role': 'member',
                  'groupName': group.Item.groupName,
                  'data': args.groupId
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
      return {msg: 'success'};
    },
    updateUser: async (_, args, context) => {

      const groupParams = {
        TableName: "GolfPool",
        IndexName: "type-data-index",
        KeyConditionExpression:"#type = :typeValue and begins_with(#data, :dataValue)",
        ExpressionAttributeNames: {
            "#type":"type",
            "#data":"data"
        },
        ExpressionAttributeValues: {
            ":typeValue": context.user.id,
            ":dataValue": 'Group-'
        }
      }
      let groups = await context.dataSources.userAPI.query(groupParams)

      let writeQuery = groups.Items.map(g=>({PutRequest: {Item: {...g, firstName: args.firstName, lastName: args.lastName }  }}))

      const batchParams = {
        RequestItems: {
          'GolfPool': writeQuery
        }
      }
      try {
        let group = await context.dataSources.userAPI.batchWrite(batchParams);
      }
      catch (err) {
        console.log("Error", err)
      }

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
    },
    inviteToGroup: async (_, args, context) => {
      const params = {
        TableName: "GolfPool",
        Key: {
          id: args.groupId,
          type: args.groupId
        }
      }
      let group = await context.dataSources.userAPI.get(params);
      if (!group.Item.invites.includes(args.email)) {
        group.Item.invites.push(args.email);
        const updateParams = {
          TableName:"GolfPool",
          Key:{
              "id": args.groupId,
              "type": args.groupId
          },
          UpdateExpression: "set invites = :i",
          ExpressionAttributeValues:{
              ":i": group.Item.invites
          },
          ReturnValues:"UPDATED_NEW"
        }
        let res = await context.dataSources.userAPI.update(updateParams);
        return 'invited!'
      }
      console.log(group)
      return 'e'
    }
  },
  User: {
    async email(parent, args, context, info) {
      return parent.email
    }
  },
};


module.exports = resolvers;