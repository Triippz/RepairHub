import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserRequest } from './dtos/request/create-user.request';
import { UserResponse } from './dtos/response/user.response';
import { Role } from '@prisma/client';
import config from '../config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserEntityById(id: number): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async getUserById(id: number): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with UserID~${id} was not found`);
    }

    return UserResponse.fromUserEntity(user);
  }

  public async getUserEntityByEmail(email: string): Promise<AuthUser | null> {
    const normalizedEmail = email.toLowerCase();
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  public async createUser(
    createUser: CreateUserRequest,
  ): Promise<UserResponse> {
    const normalizedEmail = createUser.email.toLowerCase();
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: bcrypt.hashSync(createUser.password, 10),
        role: Role.USER,
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        imageUrl: createUser?.imageUrl,
        phoneNumber: createUser?.phoneNumber,
        hubspotUserId: createUser.hubspotUserId,
        portalId: createUser.portalId,
      },
    });

    return UserResponse.fromUserEntity(user);
  }

  async getByHubspotUserId(
    hubspotUserId: string,
    portalId: number,
  ): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        portalId_hubspotUserId: {
          portalId: portalId,
          hubspotUserId: hubspotUserId,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with HubSpot UserID~${hubspotUserId} was not found`,
      );
    }
    return UserResponse.fromUserEntity(user);
  }
}
