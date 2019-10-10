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
    }
  },
  Mutation: {
    updateUser: async (_, args, context) => {
      const params = {
        TableName:"Users",
        Key:{
            "id": context.user.id
        },
        UpdateExpression: "set firstName = :f, lastName=:l",
        ExpressionAttributeValues:{
            ":f": args.firstName,
            ":l": args.lastName
        },
        ReturnValues:"UPDATED_NEW"
      }
      let user = await context.dataSources.userAPI.update(params)
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