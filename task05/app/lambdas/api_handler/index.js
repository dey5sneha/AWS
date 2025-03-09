const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TARGET_TABLE;

exports.handler = async (event) => {
    try {
        // Parse the request body
        const requestBody = JSON.parse(event.body);
        const { principalId, content } = requestBody;

        // Assemble the new event data model
        const newEvent = {
            id: uuidv4(), // Generate a UUID for the event
            principalId,
            createdAt: new Date().toISOString(),
            body: content
        };

        // Write the event to DynamoDB
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: newEvent
        }).promise();

        // Respond with the created event
        return {
            statusCode: 201,
            body: JSON.stringify({ event: newEvent })
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};