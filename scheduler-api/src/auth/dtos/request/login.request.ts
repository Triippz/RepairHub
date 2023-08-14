import { IsNotEmpty, MinLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginRequest {
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
