const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {appointment, hubspotUserId} = context.parameters;
    const apiKey = process.env["APP_API_KEY"];

    try {
        const response = await axios.post(`https://api.repairhub.lol/appointments/${hubspotUserId}`, appointment,{
            headers: {
                'x-api-key': apiKey,
            }
        });

        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        console.error(e.response.data)
        sendResponse({
            status: "ERROR",
            body: e.response.data.message
        });
    }
}