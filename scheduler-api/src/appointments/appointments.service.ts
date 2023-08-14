import {Injectable} from "@nestjs/common";
import {PrismaService} from "nestjs-prisma";
import {ApiTags} from "@nestjs/swagger";
import {AppointmentStatus, User} from "@prisma/client";
import {AppointmentScheduleRequest} from "./dtos/appointment-schedule-request";
import {AppointmentTimeRescheduleRequest} from "./dtos/appointment-time-reschedule.request";

@ApiTags('Appointments')
@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) {

    }

    async getAllAppointmentsForUser(userId: number) {
        return this.prisma.appointment.findMany({
            where: {
                userId: userId
            }
        });
    }

    async getUpcomingAppointmentsForUser(userId: number) {
        return this.prisma.appointment.findMany({
            where: {
                userId: userId,
                startTime: {
                    gt: new Date()
                }
            }
        });
    }

    async getAppointmentsForSvcTech(svcTechId: number) {
        return this.prisma.appointment.findMany({
            where: {
                serviceTechnicianId: svcTechId
            }
        });
    }

    async getUpcomingAppointmentsForSvcTech(svcTechId: number) {
        return this.prisma.appointment.findMany({
            where: {
                serviceTechnicianId: svcTechId,
                startTime: {
                    gt: new Date()
                }
            }
        });
    }

    async scheduleAppointment(user: User, appointment: AppointmentScheduleRequest) {
        return this.prisma.appointment.create({
            data: {
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                appointmentType: appointment.appointmentType,
                notes: appointment.notes,
                user: {
                    connect: {
                        id: user.id
                    }
                },
                serviceTechnician: {
                    connect: {
                        id: appointment.serviceTechnicianId
                    }
                }
            }
        });
    }

    async cancelAppointment(appointmentId: number) {
        return this.prisma.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                appointmentStatus: AppointmentStatus.CANCELLED
            }
        });
    }

    async completeAppointment(appointmentId: number) {
        return this.prisma.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                appointmentStatus: AppointmentStatus.COMPLETED
            }
        });
    }

    async rescheduleAppointment(appointmentId: number, rescheduleRequest: AppointmentTimeRescheduleRequest) {
        return this.prisma.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                startTime: rescheduleRequest.startTime,
                endTime: rescheduleRequest.endTime
            }
        });
    }

    async updateAppointmentNotes(appointmentId: number, notes: string) {
        return this.prisma.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                notes: notes
            }
        });
    }

}
