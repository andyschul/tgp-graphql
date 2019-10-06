const redis = require('redis')
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

const { DataSource } = require('apollo-datasource');

class SportsAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async test(one, two, three, four) {
    let year = (new Date()).getFullYear();
    let schedule = await getAsync(`schedule:${year}`);
    schedule = JSON.parse(schedule)
    return 'return from test'
  }

  async getSchedule() {
    let schedule = await getAsync(`schedule:${(new Date()).getFullYear()}`);
    schedule = JSON.parse(schedule)
    let currentTournament = schedule.tournaments.filter(t => {
      let d = new Date(t.end_date);
      d.setDate(d.getDate() + 7);
      return d > new Date();
    }).shift()
    return {currentTournament: currentTournament || {}, tournaments: schedule['tournaments']};    
  }


}

module.exports = SportsAPI;