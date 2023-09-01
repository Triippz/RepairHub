const axios = require('axios');
const hubspot = require('@hubspot/api-client');

// TODO: Add user id from app to contact property -- repairhubuserid

function addRepairHubUserIdToContact(portalId, contactId, repairHubUserId) {
    const hubSpotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN'],
    });


    // hubSpotClient.crm.contacts.basicApi.update()
}

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

    try {
        const response = await axios.post('https://api.repairhub.lol/users', createUserRequest, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        console.log(e.response.data);

        // I should handle error messages better, server side
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
