import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {PassportModule} from "@nestjs/passport";
import {UsersController} from "./users.controller";

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
