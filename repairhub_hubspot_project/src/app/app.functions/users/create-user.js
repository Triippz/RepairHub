const axios = require('axios');
const hubspot = require('@hubspot/api-client');

// const getHubSpotUser = async (contactId, privateAppToken) => {
//     const hubspotClient = new hubspot.Client({
//         accessToken: privateAppToken,
//     });
//
//     // const apiResponse = await hubspotClient.crm.contacts.basicApi.getPage();
//     const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(contactId, ["phone"]);
//     console.log(JSON.stringify(apiResponse, null, 2));
//     return apiResponse;
// }

exports.main = async (context = {}, sendResponse) => {
    const {userInfo} = context.parameters
    const apiKey = process.env["APP_API_KEY"];

    const createUserRequest = {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        hubspotUserId: userInfo.hubspotUserId,
        portalId: userInfo.portalId,
        phone: userInfo.phone,
        password: "testingpassword",
    }

    console.log(createUserRequest);

    try {
        const response = await axios.post('https://api.repairhub.lol/users', createUserRequest, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        console.log("response", response.data)

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        console.log(e.response.data);
        let message = e.response.data.message;
        if (Array.isArray(message)) {
            message = message[0];
        } else if (typeof message !== "string") {
            message = "Unknown error";
        } else {
            message = e.response.data.message;
        }

        sendResponse({
            status: "ERROR",
            body: message
        });
    }

};
