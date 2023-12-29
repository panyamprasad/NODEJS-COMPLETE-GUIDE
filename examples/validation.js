import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
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
      case "GET /items":
        body = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = body.Items;
        break;

      case "PUT /items":
        let requestJSON = JSON.parse(event.body);

        // Validate email
        if (!isValidEmail(requestJSON.email)) {
          throw new Error("Invalid email address...!");
        }

        // Vallidate UserID
        if (!isValidUserId(requestJSON.userID)) {
          throw new Error("Please give the valid userID...!");
        }

        //Password Validation
        const passwordValidationError = isValidPassword(
          requestJSON.password,
          requestJSON.confirmPassword
        );
        if (passwordValidationError) {
          throw new Error(passwordValidationError);
        }

        // PhoneNumber Validation
        if (!validPhoneNumber(requestJSON.phoneNumber)) {
          throw new Error("Please give valid phoneNumber");
        }

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

// Valid Email
function isValidEmail(email) {
  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  return emailRegex.test(email);
}

// Valid UserID
function isValidUserId(userID) {
  const userIdRegex = /^[a-zA-Z0-9]{8,}$/;
  return userIdRegex.test(userID);
}

// Valid PhoneNumber
function validPhoneNumber(phoneNumber) {
  // 10 digits format
  var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  // If you want to use a + sign before the number in the following way
  // var phoneRegex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phoneNumber);
}

// Password Validation & Confirm Password validation..
function isValidPassword(password, confirmPassword) {
  if (!password || !confirmPassword) {
    return "Password and ConfirmPassword are required";
  }
  if (password !== confirmPassword) {
    return "Password and ConfirmPassword do not match";
  }
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long and contain at least one digit and one special character (!@#$%^&*)";
  }
  return null;
}
