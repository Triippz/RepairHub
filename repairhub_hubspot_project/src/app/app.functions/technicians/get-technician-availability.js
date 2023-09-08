const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {svcTechId, serviceDate} = context.parameters;
    const apiKey = process.env["APP_API_KEY"];

    const formattedDate = `${serviceDate.year}-${serviceDate.month}-${serviceDate.date}`;

    try {
        const response = await axios.get(`https://api.repairhub.lol/svc-techs/${svcTechId}/availability/${formattedDate}`, {
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