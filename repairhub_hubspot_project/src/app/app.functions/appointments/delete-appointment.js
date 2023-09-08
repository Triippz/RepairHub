const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {appointmentId} = context.parameters;
    const apiKey = process.env["APP_API_KEY"];

    try {
        const response = await axios.delete(`https://api.repairhub.lol/appointments/${appointmentId}`, {
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