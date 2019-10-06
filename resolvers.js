const resolvers = {
  Query: {
    hello: async (parent, args, context, info) => {
      schedule = await context.dataSources.sportsAPI.getSchedule()
      return 'Hello world'
    },
    async user(parent, args, context, info) {
      return {
        email: context.user.email,
        firstName: context.user.firstName || '',
        lastName: context.user.lastName || ''
      }
    }
  },
  Mutation: {
    updateUser: async (root, args, context) => {
      console.log('test')
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