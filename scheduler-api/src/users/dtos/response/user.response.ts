import type {Role, User} from '@prisma/client';
import {ApiProperty} from "@nestjs/swagger";

export class UserResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string

    @ApiProperty()
    imageUrl: string | null;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    hubspotUserId: string;

    @ApiProperty()
    portalId: number;

    @ApiProperty()
    role: Role;
    static fromUserEntity(entity: User): UserResponse {
        const response = new UserResponse();
        response.id = entity.id;
        response.email = entity.email;
        response.name = [entity.firstName, entity.lastName]
            .filter((s) => s !== null)
            .join(' ');
        response.firstName = entity.firstName;
        response.lastName = entity.lastName;
        response.imageUrl = entity.imageUrl;
        response.phoneNumber = entity.phoneNumber;
        response.role = entity.role;
        response.hubspotUserId = entity.hubspotUserId;
        response.portalId = entity.portalId;
        return response;
    }
}
