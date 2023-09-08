import * as React from 'react';
import {TimeSlot} from "../models/dtos/svc-tech-availability.response";
import {Flex, Tag, Text} from "@hubspot/ui-extensions";
import {serverDateToLocalTime} from "../utils/date.utils";

export interface ScheduleSelectionProps {
    availableTimeSlots: TimeSlot[];
    occupiedTimeSlots: TimeSlot[];
    selectedTimeSlot: TimeSlot | undefined;
    onScheduleSelect: (timeSlot: TimeSlot) => void;
}

const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({availableTimeSlots, occupiedTimeSlots, selectedTimeSlot, onScheduleSelect}) => {

    const _renderTag = (timeSlot: TimeSlot) => (
        <Tag
            key={`time-slot-${timeSlot.startTime}-${timeSlot.endTime}`}
            onClick={() => onScheduleSelect(timeSlot)}
            variant={selectedTimeSlot?.startTime === timeSlot.startTime ? "success" : "default"}
        >
            <Text>
                {`${serverDateToLocalTime(timeSlot.startTime)} - ${serverDateToLocalTime(timeSlot.endTime)}`}
            </Text>
        </Tag>
    )

    return (
        <Flex direction="column" gap={'sm'}>
            {availableTimeSlots.map(_renderTag)}
        </Flex>
    );
}

export default ScheduleSelection;