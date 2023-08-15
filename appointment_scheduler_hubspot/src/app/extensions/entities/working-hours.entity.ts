import {ServiceTechnician} from "./service-technician.entity";

export enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export class WorkingHours {
    id: number;
    day: DayOfWeek;
    startHour: Date;
    endHour: Date;
    serviceTechnicianId: number;
    serviceTechnician?: ServiceTechnician;
}
