import {Role} from "@prisma/client";

export interface JwtPayload {
    id: number;
    role: Role;
    email: string;
}
