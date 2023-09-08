import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  SvcTechAvailibilityDto,
  TimeSlotDTO,
} from './dtos/svc-tech-availibility.dto';
import { Appointment, DayOfWeek, WorkingHours } from '@prisma/client';

@Injectable()
export class SvcTechService {
  constructor(private readonly prisma: PrismaService) {}

  async getTechs() {
    return this.prisma.serviceTechnician.findMany({
      include: {
        workingHours: true,
      },
    });
  }

  async getTech(id: number) {
    const tech = await this.prisma.serviceTechnician.findUnique({
      where: { id },
      include: {
        workingHours: true,
      },
    });

    if (!tech) {
      throw new NotFoundException(`Service Tech with ID~${id} was not found`);
    }

    return tech;
  }

  async getTechAvailabilityForDate(
    id: number,
    date: Date,
  ): Promise<SvcTechAvailibilityDto> {
    const maybeTech = await this.prisma.serviceTechnician.findUnique({
      where: { id },
      include: {
        workingHours: true,
      },
    });

    if (!maybeTech) {
      throw new NotFoundException(`Service Tech with ID~${id} was not found`);
    }

    const appointmentsForDate = await this.prisma.appointment.findMany({
      where: {
        serviceTechnicianId: id,
        startTime: {
          gte: date,
        },
      },
    });

    // Check if the tech is available for the entire day, based on their working hours
    const isOff = this.isTechOff(date, maybeTech.workingHours);
    const timeSlots = this.getTimeSlots(
      date,
      maybeTech.workingHours,
      appointmentsForDate,
    );

    return {
      isOff,
      availableTimeSlots: timeSlots.available,
      occupiedTimeSlots: timeSlots.unavailable,
      isAvailable: timeSlots.available.length > 0,
    };
  }

  private getTimeSlots = (
    date: Date,
    workingHours: WorkingHours[],
    appointmentsForDay: Appointment[],
  ): {
    available: TimeSlotDTO[];
    unavailable: TimeSlotDTO[];
  } => {
    // Determine if the tech is available for the entire day, based on their appointments and working hours. If there is no opening for a 1 hour appointment, the tech is not available for the entire day. Assume all given appointments are for the current day
    const workingHoursForDay = this.getWorkingHoursForDay(date, workingHours);

    if (!workingHoursForDay) {
      // not working today
      return {
        available: [],
        unavailable: [],
      };
    }

    const availableTimeSlots: TimeSlotDTO[] = [];
    const unavailableTimeSlots: TimeSlotDTO[] = [];

    // Define the start and end time of the working hour period
    const startHour = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        workingHoursForDay.startHour.getUTCHours(),
        workingHoursForDay.startHour.getUTCMinutes(),
      ),
    );

    const endHour = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        workingHoursForDay.endHour.getUTCHours(),
        workingHoursForDay.endHour.getUTCMinutes(),
      ),
    );

    // Define the duration of each time slot (e.g., 1 hour)
    const slotDuration = 60; // in minutes

    // Define a default appointment duration (e.g., 1 hour)
    const defaultAppointmentDuration = 60; // in minutes

    // Create time slots for the working hour period
    for (
      let startTime = new Date(startHour.getTime());
      startTime < endHour;
      startTime.setUTCMinutes(startTime.getUTCMinutes() + slotDuration)
    ) {
      const endTime = new Date(startTime.getTime());
      endTime.setUTCMinutes(endTime.getUTCMinutes() + slotDuration);

      // Check if the time slot overlaps with any appointment
      const isUnavailable = appointmentsForDay.some((appointment) => {
        const appointmentEndTime = appointment.endTime
          ? appointment.endTime
          : new Date(
              appointment.startTime.getTime() +
                defaultAppointmentDuration * 60 * 1000,
            ); // Adding default duration if endTime is not available

        return (
          (startTime.getTime() < appointmentEndTime.getTime() &&
            startTime.getTime() >= appointment.startTime.getTime()) ||
          (endTime.getTime() > appointment.startTime.getTime() &&
            endTime.getTime() <= appointmentEndTime.getTime())
        );
      });

      // Create a TimeSlotDto object (assuming you have a constructor or a method to create it)
      const timeSlot = {
        startTime: new Date(startTime.getTime()), // Creating a new Date object here
        endTime: new Date(endTime.getTime()), // Creating a new Date object here
      };

      if (isUnavailable) {
        unavailableTimeSlots.push(timeSlot);
      } else {
        availableTimeSlots.push(timeSlot);
      }
    }

    // sort all times earliest to latest
    return {
      available: availableTimeSlots.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      ),
      unavailable: unavailableTimeSlots.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      ),
    };
  };

  private isTechOff = (date: Date, workingHours: WorkingHours[]): boolean => {
    const maybeWorkingHoursForDay = this.getWorkingHoursForDay(
      date,
      workingHours,
    );

    return !maybeWorkingHoursForDay;
  };

  private getWorkingHoursForDay = (
    date: Date,
    workingHours: WorkingHours[],
  ): WorkingHours => {
    const dayOfWeek = date.getDay();
    const dayEnumArray = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];

    const currentDayOfWeek = dayEnumArray[dayOfWeek];

    return workingHours.find(
      (workingHour) => workingHour.day === currentDayOfWeek,
    );
  };
}
