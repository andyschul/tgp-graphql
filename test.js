const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

async function test() {
    const params = {
        TableName: "GolfPool",
        IndexName: "type-data-index",
        KeyConditionExpression:"#type = :typeValue and begins_with(#data, :dataValue)",
        ExpressionAttributeNames: {
            "#type":"type",
            "#data":"data"
        },
        ExpressionAttributeValues: {
            ":typeValue": 'User-1677e7c2-28d4-4fbe-99b4-12f5b70946ca',
            ":dataValue": 'Group-'
        }
    }
    let data = await docClient.query(params).promise()
    console.log(data)
}

async function testGet() {
    const params = {
        TableName: "GolfPool",
        KeyConditionExpression:"#id = :idValue",
        ExpressionAttributeNames: {
            "#id":"id",
        },
        ExpressionAttributeValues: {
            ":idValue": 'Group-c3ba8560-eed0-11e9-b823-3f902d0561d0',
        }
    }
    let {Items} = await docClient.query(params).promise()
    let group = Items.shift()

    console.log(group)
    console.log(Items)
}

testGet()
