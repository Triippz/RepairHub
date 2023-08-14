import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthUser } from './auth-user';
import {CheckEmailRequest} from "./dtos/request/check-email.request";
import {CheckEmailResponse} from "./dtos/response/check-email.response";
import {LoginRequest, LoginResponse} from "./dtos";
import {UserResponse} from "../users/dtos/response/user.response";
import {Usr} from "../users/decorators/user.decorator";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('check-email')
    @HttpCode(HttpStatus.OK)
    async checkEmailAvailability(
        @Body() checkEmailRequest: CheckEmailRequest,
    ): Promise<CheckEmailResponse> {
        const isAvailable = await this.authService.isEmailAvailable(
            checkEmailRequest.email,
        );
        return new CheckEmailResponse(isAvailable);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
        return new LoginResponse(await this.authService.login(loginRequest));
    }

    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard())
    async getUserWithToken(@Usr() user: AuthUser): Promise<UserResponse> {
        return UserResponse.fromUserEntity(user);
    }
}
