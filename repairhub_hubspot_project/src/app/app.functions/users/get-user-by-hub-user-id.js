const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {hubspotUserId} = context.parameters
    const apiKey = process.env["APP_API_KEY"];

    try {
        const response = await axios.get(`https://hubspotservicescheduler-production.up.railway.app/users/hubspot/${hubspotUserId}`, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        sendResponse({
            status: "SUCCESS",
            body: {
                status: 200,
                data: response.data
            }
        });
    } catch (e) {
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
