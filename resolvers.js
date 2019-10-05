const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    async user(parent, args, context, info) {
      return {
        email: context.user.email,
        firstName: context.user.first_name || 's',
        lastName: context.user.last_name || 's'
      }
    }
  },
  Mutation: {
    updateUser: (root, args, context) => {
      context.user.first_name = args.firstName
      context.user.last_name = args.lastName
      context.user.save()

      return {
        firstName: context.user.first_name,
        lastName: context.user.last_name,
      };
    }
  },
  User: {
    async email(parent, args, context, info) {
      return parent.email
    }
  },
};


module.exports = resolvers;