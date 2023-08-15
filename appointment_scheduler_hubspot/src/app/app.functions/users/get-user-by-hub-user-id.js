const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {accessToken, hubspotUserId} = context.parameters

    console.log("AccessToken", accessToken);
    console.log("HubSpot UserId", hubspotUserId);

    try {
        const response = await axios.get(`https://hubspotservicescheduler-production.up.railway.app/users/hubspot/${hubspotUserId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        console.log(response.data);

        sendResponse({
            status: "SUCCESS",
            body: {
                status: 200,
                data: response.data
            }
        });
    } catch (e) {
        console.log(e.response.data)

        if (e.response.data.status === 404) {
            sendResponse({
                status: "FAILURE",
                body: {
                    status: 404,
                    data: "User Not Found"
                }
            });
        } else {
            sendResponse({
                status: "FAILURE",
                body: {
                    status: e.response.data.status,
                    data: e.response.data.message
                }
            });
        }

    }
}
