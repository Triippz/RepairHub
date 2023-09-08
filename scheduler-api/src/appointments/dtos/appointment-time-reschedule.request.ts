import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsNumber} from "class-validator";

export class AppointmentTimeRescheduleRequest {
    @ApiProperty()
    @IsDate()
    startTime: Date;


    @ApiProperty()
    @IsNumber()
    durationInMinutes: number;
}
