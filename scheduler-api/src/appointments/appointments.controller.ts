import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {AppointmentsService} from "./appointments.service";
import {AppointmentScheduleRequest} from "./dtos/appointment-schedule-request";
import {Usr} from "../users/decorators/user.decorator";
import {Role, User} from "@prisma/client";
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AppRoles} from "../auth/decorators/role.decorator";
import {AppointmentTimeRescheduleRequest} from "./dtos/appointment-time-reschedule.request";


@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {

    }

    @Get("/all/user")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async getAppointmentsForUser(
        @Usr() user: User,
    ) {
        return this.appointmentsService.getAllAppointmentsForUser(user.id);
    }

    @Get("/upcoming/user")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async getUpcomingAppointmentsForUser(
        @Usr() user: User,
    ) {
        return this.appointmentsService.getUpcomingAppointmentsForUser(user.id);
    }

    @Get("/all/svc-tech/:techId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async getAppointmentsForSvcTech(@Param("techId", ParseIntPipe) techId: number) {
        return this.appointmentsService.getAppointmentsForSvcTech(techId);
    }

    @Get("/upcoming/svc-tech/:techId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async getUpcomingAppointmentsForSvcTech(@Param("techId", ParseIntPipe) techId: number) {
        return this.appointmentsService.getUpcomingAppointmentsForSvcTech(techId);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async scheduleAppointment(
        @Usr() user: User,
        @Body() appointment: AppointmentScheduleRequest
    ) {
        return this.appointmentsService.scheduleAppointment(user, appointment);
    }

    @Delete("/:id")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async cancelAppointment(@Param("id", ParseIntPipe) id: number) {
        return this.appointmentsService.cancelAppointment(id);
    }

    @Patch("/:id/complete")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async completeAppointment(@Param("id", ParseIntPipe) id: number) {
        return this.appointmentsService.completeAppointment(id);
    }

    @Patch("/:id/reschedule")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async rescheduleAppointment(
        @Param("id", ParseIntPipe) id: number,
        @Body() rescheduleRequest: AppointmentTimeRescheduleRequest
    ) {
        return this.appointmentsService.rescheduleAppointment(id, rescheduleRequest);
    }

    @Patch("/:id/notes")
    @ApiBearerAuth()
    @UseGuards(AuthGuard(), RolesGuard)
    @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
    async updateAppointmentNotes(
        @Param("id", ParseIntPipe) id: number,
        @Body("notes") notes: string
    ) {
        return this.appointmentsService.updateAppointmentNotes(id, notes);
    }
}
