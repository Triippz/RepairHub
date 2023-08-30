import {Appointment} from "./appointment.entity";

export enum Roles {
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_USER = "ROLE_USER",
    ROLE_STAFF = "ROLE_STAFF"
}

export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl: string;
    role: Roles;
    portalId: number;
    hubspotUserId: number;
    appointments?:  Appointment[]
}
