const redis = require('redis')
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

const { DataSource } = require('apollo-datasource');

class SportsAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

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