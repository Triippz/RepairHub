import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {PrismaService} from "nestjs-prisma";
import {LoginRequest} from "./dtos";
import {JwtPayload} from "./dtos/jwt-payload";
import {UsersService} from "../users/users.service";
import {AuthUser} from "./auth-user";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginRequest: LoginRequest): Promise<string> {
        const normalizedIdentifier = loginRequest.email.toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: {
                email: normalizedIdentifier
            },
            select: {
                id: true,
                password: true,
                email: true,
                role: true,
            },
        });

        if (
            user === null ||
            !bcrypt.compareSync(loginRequest.password, user.password)
        ) {
            throw new UnauthorizedException();
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role
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
}
