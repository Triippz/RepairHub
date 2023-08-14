import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus, Param, ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {UsersService} from "./users.service";
import {UserResponse} from "./dtos/response/user.response";
import {CreateUserRequest} from "./dtos/request/create-user.request";
import {Role} from "@prisma/client";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AppRoles} from "../auth/decorators/role.decorator";

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiBearerAuth()
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async createUser(
        @Body() createUserRequest: CreateUserRequest,
    ): Promise<UserResponse> {
        return this.userService.createUser(createUserRequest);
    }

    @ApiBearerAuth()
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
        return this.userService.getUserById(id);
    }

    @ApiBearerAuth()
    @Get('/hubspot/:userId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF)
    async getUserByHubSpotUserId(@Param('userId', ParseIntPipe) hubspotUserId: number): Promise<UserResponse> {
        return this.userService.getByHubspotUserId(hubspotUserId);
    }
}
