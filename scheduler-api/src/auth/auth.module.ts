import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {PrismaService} from "nestjs-prisma";
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import config from "../config";


@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: config.jwt.secretOrKey,
            signOptions: {
                expiresIn: config.jwt.expiresIn,
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, PrismaService],
    controllers: [AuthController],
})
export class AuthModule {}
