const redis = require('redis')
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

const { RESTDataSource } = require('apollo-datasource-rest');

const playerMapper = (players) => {
  return players.map(p => ({
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    country: p.country,
    status: p.status || null,
    money: p.money || null,
    position: p.position || null,
    score: p.score || null,
    strokes: p.strokes || null,
    tied: p.tied || null
  }))
}

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
    let groupsRes = await getAsync(`tournaments:${tournamentId}:groups`);
    let leaderboardRes = await getAsync(`tournaments:${tournamentId}:leaderboard`);
    let leaderboard = JSON.parse(leaderboardRes);
    tournament = JSON.parse(tournament);
    let groups = groupsRes ? JSON.parse(groupsRes): [];
    groups = groups.map((g,i)=>({id:i+1, players: playerMapper(g)}))
    return {
      id: tournament.id,
      name: tournament.name,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      purse: tournament.purse,
      winningShare: tournament.winning_share,
      venue: tournament.venue,
      groups: groups,
      leaderboard: playerMapper(leaderboard.leaderboard)
    };
  }
}

module.exports = SportsAPI;