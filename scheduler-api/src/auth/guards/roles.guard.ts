import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from "../decorators/role.decorator";
import {Role} from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<
            Role[]
        >(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if (
            requiredRoles.some((role) =>
                user.role === role
            )
        ) {
            return true;
        }

        throw new UnauthorizedException(
            "Insufficient user role",
        );
    }
}
