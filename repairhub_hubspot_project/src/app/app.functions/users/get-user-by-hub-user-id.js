const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {hubspotUserId, portalId} = context.parameters
    const apiKey = process.env["APP_API_KEY"];

    console.log(typeof hubspotUserId, typeof portalId)
    try {
        const response = await axios.get(`http://localhost:3000/users/hubspot/${hubspotUserId}/${portalId}`, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        console.log("ERROR", e);
        if (e.response.data.status === 404) {
            sendResponse({
                status: "FAILURE",
                body: "User Not Found"
            });
        } else {
            sendResponse({
                status: "FAILURE",
                body: e.response.data.message
            });
        }

    }
}
