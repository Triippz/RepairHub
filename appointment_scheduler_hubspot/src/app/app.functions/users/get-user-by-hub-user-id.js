const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {accessToken, hubspotUserId} = context.parameters

    console.log("AccessToken", accessToken);
    console.log("HubSpot UserId", hubspotUserId);
    const response = await axios.get(`https://hubspotservicescheduler-production.up.railway.app/users/hubspot/${hubspotUserId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    console.log(response.data);

    sendResponse({
        status: "SUCCESS",
        body: response.data
    });
}
