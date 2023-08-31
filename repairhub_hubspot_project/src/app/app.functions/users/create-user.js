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

        console.log(response.data)

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        console.log("error", e.response.data);
        sendResponse({
            status: "ERROR",
            body: e.response.data
        });
    }

};
