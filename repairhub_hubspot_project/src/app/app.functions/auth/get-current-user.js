const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    console.log(context.secrets);

    const apiKey = process.env["APP_API_KEY"];

    const response = await axios.get('https://hubspotservicescheduler-production.up.railway.app/auth', {
        headers: {
            'x-api-key': apiKey,
        }
    });

    sendResponse({
        status: "SUCCESS",
        body: response.data
    });
}
