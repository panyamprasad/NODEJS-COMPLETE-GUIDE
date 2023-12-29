/*import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "orderTable";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const httpMethod = event.httpMethod;
    const path = event.resource;

    switch (`${httpMethod} ${path}`) {
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
        
      case "GET /items/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;
        
      case "GET /items":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items;
        break;
        
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              userID: requestJSON.userID,
              firstName: requestJSON.firstName,
              lastName: requestJSON.lastName,
              email: requestJSON.email,
              phoneNumber: requestJSON.phoneNumber,
              address: requestJSON.address,
              dob: requestJSON.dob,
              gender: requestJSON.gender,
              password: requestJSON.password,
              confirmPassword: requestJSON.confirmPassword,
            },
          })
        );
        body = `Put item ${requestJSON.userID}`;
        break;
      default:
        throw new Error(`Unsupported route: "${httpMethod} ${path}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
*/

//Delete record from Db with out api call
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);

// export const handler = async () => {
//   const command = new DeleteCommand({
//     TableName: "orderTable",
//     Key: {
//       id: "4",
//     },
//   });

//   const response = await docClient.send(command);
//   console.log(response);
//   return response;
// };

//Update function for update the record from DB without api call.

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);

// export const handler = async () => {
//   const command = new UpdateCommand({
//     TableName: "orderTable",
//     Key: {
//       id: "1",
//     },
//     UpdateExpression: "set lastName = :lastName",
//     ExpressionAttributeValues: {
//       ":lastName" : "Dega",
//     },
//     ReturnValues: "ALL_NEW",
//   });

//   const response = await docClient.send(command);
//   console.log(response);
//   return response;
// };

//Table creation using lambda function
// import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({});

// export const handler = async () => {
//   const command = new CreateTableCommand({
//     TableName: "EspressoDrinks",

//     AttributeDefinitions: [
//       {
//         AttributeName: "DrinkName",
//         AttributeType: "S",
//       },
//     ],
//     KeySchema: [
//       {
//         AttributeName: "DrinkName",
//         KeyType: "HASH",
//       },
//     ],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 1,
//       WriteCapacityUnits: 1,
//     },
//   });
//   try {
//     const response = await client.send(command);
//     console.log("Table created successfully:", response);
//   } catch (error) {
//     console.error("Error creating table:", error);
//   }
// }

//Insert the record inside the table
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// const client = new DynamoDBClient({});
// const docClient = DynamoDBDocumentClient.from(client);

// export const handler = async () => {
//   const command = new PutCommand({
//     TableName: "EspressoDrinks",
//     Item: {
//       DrinkName: "Tea",
//       Cost: "45",
//     },
//   });

//   const response = await docClient.send(command);
//   console.log(response);
//   return response;
// };

//Scan the table

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  const command = new ScanCommand({
    ProjectionExpression: "#DrinkName, Cost",
    ExpressionAttributeNames: { "#DrinkName": "DrinkName" },
    TableName: "EspressoDrinks",
  });

  const response = await docClient.send(command);
  for (const EspressoDrinks of response.Items) {
    console.log(`${EspressoDrinks.DrinkName} - (${EspressoDrinks.Cost}`);
  }
  return response;
};
