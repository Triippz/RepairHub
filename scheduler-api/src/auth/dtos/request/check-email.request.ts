import { IsEmail, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CheckEmailRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
