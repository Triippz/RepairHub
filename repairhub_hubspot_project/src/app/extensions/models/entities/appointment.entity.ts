import {User} from "./user.entity";
import {ServiceTechnician} from "./service-technician.entity";

export enum AppointmentType {
    INSTALLATION = "INSTALLATION",
    REPAIR = "REPAIR",
    MAINTENANCE = "MAINTENANCE",
}

export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export class Appointment {
    id: number;
    startTime: Date;
    endTime: Date;
    notes: string;
    appointmentStatus: AppointmentStatus;
    appointmentType: AppointmentType;
    userId: number;
    user?: User;
    serviceTechnicianId: number;
    serviceTechnician?: ServiceTechnician;
}
