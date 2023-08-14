import { CustomDecorator, SetMetadata } from '@nestjs/common';
import {Role} from "@prisma/client";

export const ROLES_KEY = 'roles';
export const AppRoles = (...roles: Role[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
