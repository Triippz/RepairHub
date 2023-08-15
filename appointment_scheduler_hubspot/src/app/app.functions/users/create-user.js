const axios = require('axios');
const hubspot = require('@hubspot/api-client');

const getHubSpotUser = async (contactId) => {
    const hubspotClient = new hubspot.Client({
        accessToken: context.secrets.PRIVATE_APP_ACCESS_TOKEN,
    });

    const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(contactId, undefined, undefined, undefined, false);
    console.log(JSON.stringify(apiResponse, null, 2));
    return apiResponse;
}

exports.main = async (context = {}, sendResponse) => {
    const {accessToken, userInfo} = context.parameters

    const contact = await getHubSpotUser(userInfo.hubspotUserId);
    const createUserRequest = {
        email: userInfo.email,
        firstName: userInfo.firstname,
        lastName: userInfo.lastname,
        hubspotUserId: userInfo.hubspotUserId,
        phone: contact.properties.phone,
        imageUrl: contact.properties.imageurl,
        password: "testingpassword",
    }

    const response = await axios.post('https://hubspotservicescheduler-production.up.railway.app/users', createUserRequest, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    console.log(response.data)
    sendResponse({
        status: "SUCCESS",
        body: response.data
    });

};
