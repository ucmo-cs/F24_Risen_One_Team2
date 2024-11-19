const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const employeeName = event.queryStringParameters.employeeName;
    const monthYear = event.queryStringParameters.monthYear;
    const projectID = event.queryStringParameters.projectID;  // Retrieve the projectID from the request

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
            // If record exists, filter DailyHours by projectID
            const filteredDailyHours = result.Item.DailyHours.map(dayEntries =>
                dayEntries.filter(entry => entry.ProjectID === projectID)
            );

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Filtered timecard data retrieved successfully',
                    data: {
                        ...result.Item,
                        DailyHours: filteredDailyHours  // Replace DailyHours with the filtered data
                    }
                })
            };
        } else {
            // If no record found for the given employeeName and monthYear
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
