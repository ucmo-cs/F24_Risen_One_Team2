const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Extract parameters from the request
    const projectName = event.queryStringParameters.projectName; // Primary key
    const monthYear = event.queryStringParameters.monthYear; // Sort key

    try {
        // Get the specific timecard data for the given project and monthYear
        const getParams = {
            TableName: 'TimeCardData',
            Key: {
                'projectName': projectName,
                'monthYear': monthYear,
            },
        };

        const result = await dynamoDb.get(getParams).promise();

        if (result.Item) {
            // Extract and structure the Employees object
            const employeesData = Object.entries(result.Item.Employees).map(([employeeName, data]) => ({
                employeeName,
                DailyHours: data.DailyHours,
            }));

            // Return the success response with CORS headers
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allows all origins (or specify 'http://localhost:4200' for dev)
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET', // Allow these methods
                    'Access-Control-Allow-Headers': 'Content-Type', // Allow Content-Type header
                },
                body: JSON.stringify({
                    message: 'Employee timecard data retrieved successfully',
                    data: employeesData,
                }),
            };
        } else {
            // No data found for the given project and monthYear
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({
                    message: 'No timecard data found for the specified project and month',
                }),
            };
        }
    } catch (error) {
        // Log the error and return a failure response
        console.error('Error retrieving timecard:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Error retrieving timecard', error: error.message }),
        };
    }
};
