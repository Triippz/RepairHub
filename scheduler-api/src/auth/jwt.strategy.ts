import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import config from '../config';
import { AuthUser } from './auth-user';
import {JwtPayload} from "./dtos/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secretOrKey,
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
