import {WorkingHours} from "./working-hours.entity";
import {Appointment} from "./appointment.entity";

export class ServiceTechnician {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    workingHours: WorkingHours[];
    appointments: Appointment[]
}
