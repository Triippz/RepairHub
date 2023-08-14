import {ApiProperty} from "@nestjs/swagger";
import {IsDate} from "class-validator";

export class AppointmentTimeRescheduleRequest {
    @ApiProperty()
    @IsDate()
    startTime: Date;

    @ApiProperty()
    @IsDate()
    endTime: Date;
}
