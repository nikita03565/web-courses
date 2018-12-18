const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const username = event.requestContext.authorizer.claims['cognito:username'];

    const requestBody = JSON.parse(event.body);
    const name = requestBody.name;
    const family_name = requestBody.family_name;
    const amount = requestBody.amount;

    recordPerson(username, name, family_name, amount).then(() => {
        console.log("callback in lambda1");
        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                Eta: '30 seconds',
                Owner: username,
            }),

        });
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback);
    });
};

function recordPerson(username, name, family_name, amount) {
    var personName;
    if (family_name != "") {
        personName = name + " " + family_name;
    } else {
        personName = name;
    }
    return ddb.put({
        TableName: 'webcourses',
        Item: {
            Person: personName,
            UserOwner: username,
            Amount: amount
        },
    }).promise();
}

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
