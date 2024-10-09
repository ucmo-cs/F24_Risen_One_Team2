'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    const params = {
        TableName: process.env.EMPLOYEES_TABLE,
        Key: {
            employeeID: requestBody.employeeID
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();

        if (!data.Item || data.Item.employeeID !== requestBody.employeeID) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Employee does not exist' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Employee found' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};