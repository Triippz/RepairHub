import {Module} from "@nestjs/common";
import {AppointmentsService} from "./appointments.service";
import {AppointmentsController} from "./appointments.controller";

@Module({
    imports: [],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule {}
