export interface TimeSlot {
    startTime: Date;
    endTime: Date;
}

export interface SvcTechAvailibilityResponse {
    isOff: boolean;
    isAvailable: boolean;
    occupiedTimeSlots: TimeSlot[];
    availableTimeSlots: TimeSlot[];
}

export const defaultSvcTechAvailibilityResponse: SvcTechAvailibilityResponse = {
    isOff: false,
    isAvailable: false,
    occupiedTimeSlots: [],
    availableTimeSlots: []
}