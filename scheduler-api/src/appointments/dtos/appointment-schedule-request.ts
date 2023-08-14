import {AppointmentType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNumber, IsString} from "class-validator";

export class AppointmentScheduleRequest {
    @ApiProperty()
    @IsDate()
    startTime: Date;

    @ApiProperty()
    @IsDate()
    endTime: Date;

    @ApiProperty()
    @IsNumber()
    serviceTechnicianId: number;

    @ApiProperty()
    appointmentType: AppointmentType;

    @ApiProperty()
    @IsString()
    notes?: string;
}
