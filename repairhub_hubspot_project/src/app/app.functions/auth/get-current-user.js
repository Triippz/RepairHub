const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const apiKey = process.env["APP_API_KEY"];

    const response = await axios.get('https://api.repairhub.lol/auth', {
        headers: {
            'x-api-key': apiKey,
        }
    });

    sendResponse({
        status: "SUCCESS",
        body: response.data
    });
}
