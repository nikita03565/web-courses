const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }
    const username = event.requestContext.authorizer.claims['cognito:username'];
    var params = {
        Key: String,
        ExpressionAttributeNames: {
            "#uo": "UserOwner",
        },
        ExpressionAttributeValues: {
            ':user': username
        },
        FilterExpression: '#uo = :user',
        TableName: 'webcourses'
    };
    console.log("in the lambda2");
    ddb.scan(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Scan succeeded.");
            data.Items.forEach(function(element, index, array) {
                console.log(element);
            });
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST'
                },
                body: JSON.stringify(data.Items)
            });
        }
    });
};

function errorResponse(errorMessage, awsRequestId, callback) {
    callback(null, {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
}
