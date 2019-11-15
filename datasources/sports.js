const redis = require('redis')
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

const { RESTDataSource } = require('apollo-datasource-rest');

class SportsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.SPORTS_RADAR_URI;
  }

  async getSchedule(year) {
    let schedule = await getAsync(`schedule:${year}`);
    return JSON.parse(schedule);
  }

  async getTournament(tournamentId) {
    let tournament = await getAsync(`tournaments:${tournamentId}`);
    tournament = JSON.parse(tournament);
    return {
      id: tournament.id,
      name: tournament.name,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      purse: tournament.purse,
      winningShare: tournament.winning_share,
      venue: tournament.venue
    }
  }
}

module.exports = SportsAPI;