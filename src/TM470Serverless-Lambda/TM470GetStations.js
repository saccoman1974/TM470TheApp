'use strict';
const AWS = require('aws-sdk');

exports.handler = async(event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();


    let responseBody  = "";
    let statusCode = 0;

    const params = {
        TableName: "Stations"
    };
    try {
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch (err) {
        responseBody = 'unable to get stations: ${err}';
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "Application/json"
        },
        body: responseBody  
    };
    return response;
};