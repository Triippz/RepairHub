import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SvcTechService } from './svc-tech.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import {SvcTechAvailibilityDto} from "./dtos/svc-tech-availibility.dto";
import {ParseDatePipe} from "../common/pipes/parse-date.pipe";

@ApiTags('Service Technicians')
@Controller('svc-techs')
export class SvcTechController {
  constructor(private readonly svcTechService: SvcTechService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  async getTechs() {
    return this.svcTechService.getTechs();
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  async getTech(@Param('id', ParseIntPipe) id: number) {
    return this.svcTechService.getTech(id);
  }

  @Get(':id/availability/:date')
  @UseGuards(ApiKeyGuard)
  async getTechAvailabilityForDate(
    @Param('id', ParseIntPipe) id: number,
    @Param('date', ParseDatePipe) date: Date,
  ): Promise<SvcTechAvailibilityDto> {
    return this.svcTechService.getTechAvailabilityForDate(id, date);
  }
}
