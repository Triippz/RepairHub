import * as process from "process";

export default {
    jwt: {
        secretOrKey: process.env.JWT_SECRET ?? "__JWT_SECRET__",
        expiresIn: 86400000,
    },
    hubspot: {
        portalId: process.env.HUBSPOT_PORTAL_ID ? Number.parseInt(process.env.HUBSPOT_PORTAL_ID) : 42762659,
    }
};
