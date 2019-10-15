const { DataSource } = require('apollo-datasource');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

class UserAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async get(params) {
    return docClient.get(params).promise()
  }

  async update(params) {
    return docClient.update(params).promise()
  }

  async put(params) {
    return docClient.put(params).promise()
  }

  async query(params) {
    return docClient.query(params).promise()
  }

  async batchWrite(params) {
    return docClient.batchWrite(params).promise()
  }
}

module.exports = UserAPI;