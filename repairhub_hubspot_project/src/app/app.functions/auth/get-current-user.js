const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {accessToken} = context.parameters

    const response = await axios.get('https://hubspotservicescheduler-production.up.railway.app/auth', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    sendResponse({
        status: "SUCCESS",
        body: response.data
    });
}
