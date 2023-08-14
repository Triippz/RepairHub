import type {Role, User} from '@prisma/client';

export class UserResponse {
    id: number;

    email: string;

    name: string;

    firstName: string;

    lastName: string

    imageUrl: string | null;

    phoneNumber: string;

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
        return response;
    }
}
