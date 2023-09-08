import { AppointmentType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class AppointmentScheduleRequest {
  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  @IsNumber()
  durationInMinutes: number;

  @ApiProperty()
  @IsNumber()
  serviceTechnicianId: number;

  @ApiProperty()
  appointmentType: AppointmentType;
}
