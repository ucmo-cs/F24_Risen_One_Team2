const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const employeeName = event.queryStringParameters.employeeName;
    const monthYear = event.queryStringParameters.monthYear;

    try {
        // Parameters to retrieve data for the specific employee and month
        const getParams = {
            TableName: 'TimeCard',
            Key: {
                'employeeName': employeeName,
                'monthYear': monthYear
            }
        };

        // Fetch the record from DynamoDB
        const result = await dynamoDb.get(getParams).promise();

        if (result.Item) {
            // If record exists, return the timecard data
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Timecard retrieved successfully',
                    data: result.Item
                })
            };
        } else {
            // If no record found for the given employeeID and monthYear
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Timecard not found for the specified employee and month'
                })
            };
        }

    } catch (error) {
        console.error('Error retrieving timecard:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving timecard', error }),
        };
    }
};
