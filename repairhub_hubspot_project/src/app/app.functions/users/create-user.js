const axios = require('axios');
const hubspot = require('@hubspot/api-client');

const getHubSpotUser = async (contactId, privateAppToken) => {
    const hubspotClient = new hubspot.Client({
        accessToken: privateAppToken,
    });

    // const apiResponse = await hubspotClient.crm.contacts.basicApi.getPage();
    const apiResponse = await hubspotClient.crm.contacts.basicApi.getById(contactId, ["phone"]);
    console.log(JSON.stringify(apiResponse, null, 2));
    return apiResponse;
}

exports.main = async (context = {}, sendResponse) => {
    const {userInfo} = context.parameters
    const apiKey = process.env["APP_API_KEY"];
    const privateAppToken = context.secrets.PRIVATE_APP_ACCESS_TOKEN;

    console.log(process.env)

    const contact = await getHubSpotUser(userInfo.hubspotUserId, privateAppToken);
    const createUserRequest = {
        email: userInfo.email,
        firstName: userInfo.firstname,
        lastName: userInfo.lastname,
        hubspotUserId: userInfo.hubspotUserId,
        phone: contact.properties.phone,
        imageUrl: contact.properties.imageurl,
        password: "testingpassword",
    }

    console.log(createUserRequest);

    // const response = await axios.post('https://hubspotservicescheduler-production.up.railway.app/users', createUserRequest, {
    //     headers: {
    //         'x-api-key': apiKey,
    //     }
    // });

    // console.log(response.data)
    sendResponse({
        status: "SUCCESS",
        body: "ok"
    });

};
