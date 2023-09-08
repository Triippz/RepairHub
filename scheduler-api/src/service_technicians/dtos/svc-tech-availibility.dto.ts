import { ApiProperty } from '@nestjs/swagger';

export interface TimeSlotDTO {
  startTime: Date;
  endTime: Date;
}

export class SvcTechAvailibilityDto {
  @ApiProperty()
  isOff: boolean;
  @ApiProperty()
  isAvailable: boolean;
  @ApiProperty()
  occupiedTimeSlots: TimeSlotDTO[];
  @ApiProperty()
  availableTimeSlots: TimeSlotDTO[];
}
