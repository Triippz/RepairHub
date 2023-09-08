import {AppointmentType} from "../entities/appointment.entity";

export interface AppointmentScheduleRequest {
    startTime?: Date;
    serviceTechnicianId?: number;
    appointmentType?: AppointmentType;
    durationInMinutes?: number;
}

export const defaultAppointmentScheduleRequest: AppointmentScheduleRequest = {
    startTime: new Date(),
    serviceTechnicianId: 1,
    appointmentType: AppointmentType.INSTALLATION,
    durationInMinutes: 60,
}
