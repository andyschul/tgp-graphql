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
    let schedule = await getAsync('schedule:2019');
    return JSON.parse(schedule);
  }
}

module.exports = SportsAPI;