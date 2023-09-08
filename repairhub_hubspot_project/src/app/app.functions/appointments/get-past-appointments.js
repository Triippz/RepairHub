const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {appUserId} = context.parameters;
    const apiKey = process.env["APP_API_KEY"];

    try {
        const response = await axios.get(`https://api.repairhub.lol/appointments/past/user/${appUserId}`, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        sendResponse({
            status: "ERROR",
            body: e.response.data.message
        });
    }
}