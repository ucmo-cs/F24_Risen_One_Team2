const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { projectName, monthYear, employeeName, day, hours } = JSON.parse(event.body);
    const dayIndex = day - 1; // Convert day to 0-indexed

    try {
        // Fetch the current timecard for the project and month
        const getParams = {
            TableName: 'TimeCardData',
            Key: {
                'projectName': projectName,
                'monthYear': monthYear,
            },
        };

        const result = await dynamoDb.get(getParams).promise();

        let employees;
        if (result.Item) {
            // If the record exists, get the Employees object
            employees = result.Item.Employees || {};
        } else {
            // Initialize an empty Employees object if no record exists
            employees = {};
        }

        // Check if the employee already has a DailyHours array
        if (!employees[employeeName]) {
            // Initialize DailyHours for the employee with 31 days
            employees[employeeName] = { DailyHours: Array(31).fill(0) };
        }

        // Update the specific day's hours for the employee
        employees[employeeName].DailyHours[dayIndex] = hours;

        // Update or create the record in DynamoDB with the modified Employees object
        const updateParams = {
            TableName: 'TimeCardData',
            Key: {
                'projectName': projectName,
                'monthYear': monthYear,
            },
            UpdateExpression: 'SET Employees = :updatedEmployees',
            ExpressionAttributeValues: {
                ':updatedEmployees': employees,
            },
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
            body: JSON.stringify({ message: 'Error updating timecard', error: error.message }),
        };
    }
};
