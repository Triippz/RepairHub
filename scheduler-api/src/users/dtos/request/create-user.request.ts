import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserRequest {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    imageUrl: string;
}
