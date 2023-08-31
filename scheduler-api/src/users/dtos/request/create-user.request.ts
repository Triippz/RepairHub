import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty()
    @IsString()
    hubspotUserId: string

    @ApiProperty()
    @IsNumber()
    portalId: number
}
