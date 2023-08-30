import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUser } from './auth-user';
import { CheckEmailRequest } from './dtos/request/check-email.request';
import { CheckEmailResponse } from './dtos/response/check-email.response';
import { LoginRequest, LoginResponse } from './dtos';
import { UserResponse } from '../users/dtos/response/user.response';
import { Usr } from '../users/decorators/user.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeysResponse } from './dtos/response/api-keys.response';
import { ApiKey } from '@prisma/client';

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

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard)
  async getUserWithToken(@Usr() user: AuthUser): Promise<UserResponse> {
    return UserResponse.fromUserEntity(user);
  }

  @Get('api-keys')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getApiKeys(@Usr() user: AuthUser): Promise<ApiKeysResponse> {
    return this.authService.getApiKeysForUser(user.id);
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async createApiKey(@Usr() user: AuthUser): Promise<ApiKey> {
    return this.authService.createApiKeyForUser(user.id);
  }

  @Delete('api-keys/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async deleteApiKey(
    @Usr() user: AuthUser,
    @Param('key') key: string,
  ): Promise<void> {
    await this.authService.deleteApiKeyForUser(user.id, key);
  }
}
