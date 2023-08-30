const axios = require('axios');


exports.main = async (context = {}, sendResponse) => {
    const {email, password} = context.parameters

    const response = await axios.post('https://hubspotservicescheduler-production.up.railway.app/auth/login', {
        email: email,
        password: password
    });

    sendResponse({
        status: "SUCCESS",
        body: response.data
    });

};

