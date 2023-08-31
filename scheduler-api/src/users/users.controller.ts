import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus, Param, ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {UsersService} from "./users.service";
import {UserResponse} from "./dtos/response/user.response";
import {CreateUserRequest} from "./dtos/request/create-user.request";
import {Role} from "@prisma/client";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AppRoles} from "../auth/decorators/role.decorator";
import {ApiKeyGuard} from "../auth/guards/api-key.guard";

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(ApiKeyGuard, RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async createUser(
        @Body() createUserRequest: CreateUserRequest,
    ): Promise<UserResponse> {
        return this.userService.createUser(createUserRequest);
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ApiKeyGuard, RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
        return this.userService.getUserById(id);
    }

    @Get('/hubspot/:userId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ApiKeyGuard, RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async getUserByHubSpotUserId(@Param('userId') hubspotUserId: string): Promise<UserResponse> {
        return this.userService.getByHubspotUserId(hubspotUserId);
    }
}
