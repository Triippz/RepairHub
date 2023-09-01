import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentScheduleRequest } from './dtos/appointment-schedule-request';
import { Usr } from '../users/decorators/user.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AppRoles } from '../auth/decorators/role.decorator';
import { AppointmentTimeRescheduleRequest } from './dtos/appointment-time-reschedule.request';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('/all/user/:userId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async getAppointmentsForUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.appointmentsService.getAllAppointmentsForUser(userId);
  }

  @Get('/upcoming/user/:userId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async getUpcomingAppointmentsForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.appointmentsService.getUpcomingAppointmentsForUser(userId);
  }

  @Get('/past/user/:userId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async getPastAppointmentsForUser(
      @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.appointmentsService.getPastAppointmentsForUser(userId);
  }

  @Get('/all/svc-tech/:techId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async getAppointmentsForSvcTech(
    @Param('techId', ParseIntPipe) techId: number,
  ) {
    return this.appointmentsService.getAppointmentsForSvcTech(techId);
  }

  @Get('/upcoming/svc-tech/:techId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async getUpcomingAppointmentsForSvcTech(
    @Param('techId', ParseIntPipe) techId: number,
  ) {
    return this.appointmentsService.getUpcomingAppointmentsForSvcTech(techId);
  }

  @Post('/:userId')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async scheduleAppointment(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() appointment: AppointmentScheduleRequest,
  ) {
    return this.appointmentsService.scheduleAppointment(userId, appointment);
  }

  @Delete('/:id')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.cancelAppointment(id);
  }

  @Patch('/:id/complete')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async completeAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.completeAppointment(id);
  }

  @Patch('/:id/reschedule')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async rescheduleAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() rescheduleRequest: AppointmentTimeRescheduleRequest,
  ) {
    return this.appointmentsService.rescheduleAppointment(
      id,
      rescheduleRequest,
    );
  }

  @Patch('/:id/notes')
  @UseGuards(ApiKeyGuard, RolesGuard)
  @AppRoles(Role.ADMIN, Role.STAFF, Role.USER)
  async updateAppointmentNotes(
    @Param('id', ParseIntPipe) id: number,
    @Body('notes') notes: string,
  ) {
    return this.appointmentsService.updateAppointmentNotes(id, notes);
  }
}
