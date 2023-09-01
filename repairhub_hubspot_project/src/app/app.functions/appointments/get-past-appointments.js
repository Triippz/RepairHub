const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {appUserId} = context.parameters;
    const apiKey = process.env["APP_API_KEY"];

    try {
        const response = await axios.get(`http://localhost:3000/appointments/past/user/${appUserId}`, {
            headers: {
                'x-api-key': apiKey,
            }
        });

        console.log(response.data)
        sendResponse({
            status: "SUCCESS",
            body: response.data
        });
    } catch (e) {
        sendResponse({
            status: "ERROR",
            body: e.message
        });
    }
}