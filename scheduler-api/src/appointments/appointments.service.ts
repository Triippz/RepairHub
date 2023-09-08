import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentScheduleRequest } from './dtos/appointment-schedule-request';
import { AppointmentTimeRescheduleRequest } from './dtos/appointment-time-reschedule.request';

@ApiTags('Appointments')
@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAppointmentsForUser(userId: number) {
    return this.prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async getUpcomingAppointmentsForUser(userId: number) {
    // Get all appointsments for the user that have not started yet and are SCHEDULED or IN_PROGRESS
    return this.prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentStatus: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
        },
      },
      include: {
        serviceTechnician: true,
      },
      orderBy: {
        appointmentStatus: 'desc',
      },
    });
  }

  async getPastAppointmentsForUser(userId: number) {
    return this.prisma.appointment.findMany({
      where: {
        userId: userId,
        endTime: {
          lt: new Date(),
        },
        appointmentStatus: {
          in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
        },
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async getAppointmentsForSvcTech(svcTechId: number) {
    return this.prisma.appointment.findMany({
      where: {
        serviceTechnicianId: svcTechId,
      },
      include: {
        serviceTechnician: true,
        user: true,
      },
    });
  }

  async getUpcomingAppointmentsForSvcTech(svcTechId: number) {
    return this.prisma.appointment.findMany({
      where: {
        serviceTechnicianId: svcTechId,
        startTime: {
          gt: new Date(),
        },
        appointmentStatus: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
        },
      },
      include: {
        serviceTechnician: true,
        user: true,
      },
    });
  }

  async scheduleAppointment(
    userId: number,
    appointment: AppointmentScheduleRequest,
  ) {
    return this.prisma.appointment.create({
      data: {
        startTime: appointment.startTime,
        appointmentType: appointment.appointmentType,
        durationInMinutes: appointment?.durationInMinutes ?? 60,
        user: {
          connect: {
            id: userId,
          },
        },
        serviceTechnician: {
          connect: {
            id: appointment.serviceTechnicianId,
          },
        },
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async cancelAppointment(appointmentId: number) {
    return this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        appointmentStatus: AppointmentStatus.CANCELLED,
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async completeAppointment(appointmentId: number) {
    return this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        appointmentStatus: AppointmentStatus.COMPLETED,
        endTime: new Date(),
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async rescheduleAppointment(
    appointmentId: number,
    rescheduleRequest: AppointmentTimeRescheduleRequest,
  ) {
    return this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        startTime: rescheduleRequest.startTime,
        durationInMinutes: rescheduleRequest.durationInMinutes ?? 60,
      },
      include: {
        serviceTechnician: true,
      },
    });
  }

  async updateAppointmentNotes(appointmentId: number, notes: string) {
    return this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes: notes,
      },
      include: {
        serviceTechnician: true,
      },
    });
  }
}
