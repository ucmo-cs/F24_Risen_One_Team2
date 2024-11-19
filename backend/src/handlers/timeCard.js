const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Parse the body from the event
    const { employeeName, monthYear, projectID, day, hours }=JSON.parse(event.body);
    const dayIndex = day - 1;  // Convert day to 0-indexed

    try {
        // Attempt to fetch the current timecard for the employee and month
        const getParams = {
            TableName: 'TimeCard',
            Key: {
                'employeeName': employeeName,
                'monthYear': monthYear  // Ensure this is correct
            }
        };

        const result = await dynamoDb.get(getParams).promise();

        let dailyHours;
        if (result.Item) {
            // If record exists, get the DailyHours array
            dailyHours = result.Item.DailyHours;
        } else {
            // Initialize DailyHours array with 31 days if no record exists
            dailyHours = Array(31).fill([]).map(() => []);
        }

        // Find or add the project entry for the specific day
        const projectsForDay = dailyHours[dayIndex];
        let projectEntry = projectsForDay.find(project => project.ProjectID === projectID);

        if (projectEntry) {
            // Update the hours if project already exists for the day
            projectEntry.Hours = hours;
        } else {
            // Add a new project entry if it doesn't exist for the day
            projectsForDay.push({ ProjectID: projectID, Hours: hours });
        }

        // Update or create the record in DynamoDB with the modified DailyHours array
        const updateParams = {
            TableName: 'TimeCard',
            Key: {
                'employeeName': employeeName,
                'monthYear': monthYear  // Ensure this is correct
            },
            UpdateExpression: 'SET DailyHours = :updatedDailyHours',
            ExpressionAttributeValues: {
                ':updatedDailyHours': dailyHours
            }
        };

        await dynamoDb.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Timecard updated successfully' }),
        };

    } catch (error) {
        console.error('Error updating timecard:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating timecard', error }),
        };
    }
};
