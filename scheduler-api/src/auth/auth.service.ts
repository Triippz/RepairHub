import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { LoginRequest } from './dtos';
import { JwtPayload } from './dtos/jwt-payload';
import { UsersService } from '../users/users.service';
import { AuthUser } from './auth-user';
import { ApiKey, User } from '@prisma/client';
import { ApiKeysResponse } from './dtos/response/api-keys.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(loginRequest: LoginRequest): Promise<User> {
    const normalizedIdentifier = loginRequest.email.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        email: normalizedIdentifier,
      },
    });

    if (
      user === null ||
      !bcrypt.compareSync(loginRequest.password, user.password)
    ) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(loginRequest: LoginRequest): Promise<string> {
    const user = await this.validate(loginRequest);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (
      user !== null &&
      user.email === payload.email &&
      user.role === payload.role
    ) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async validateApiKey(apiKey: string) {
    const maybeApiKey = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (maybeApiKey) {
      return maybeApiKey.user;
    }

    return null;
  }

  async getApiKeysForUser(userId: number): Promise<ApiKeysResponse> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { userId },
    });

    return {
      apiKeys: apiKeys.map((apiKey) => ({
        key: apiKey.key,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      })),
    };
  }

  async createApiKeyForUser(id: number): Promise<ApiKey> {
    const key = this.generateApiKey(id);
    return this.prisma.apiKey.create({
      data: {
        user: { connect: { id } },
        key,
      },
    });
  }

  async deleteApiKeyForUser(userId: number, key: string): Promise<ApiKey> {
    return this.prisma.apiKey.delete({
      where: { userId, key },
    });
  }

  private generateApiKey(userId: number): string {
    return bcrypt.hashSync(`${userId}-${Date.now()}`, 10);
  }
}
