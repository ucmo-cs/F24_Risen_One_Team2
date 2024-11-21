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

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Employee timecard data retrieved successfully',
                    data: employeesData,
                }),
            };
        } else {
            // No data found for the given project and monthYear
            return {
                statusCode: 404,
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
            body: JSON.stringify({ message: 'Error retrieving timecard', error: error.message }),
        };
    }
};
