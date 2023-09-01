import {Button, ButtonRow} from "@hubspot/ui-extensions";
import * as React from "react";

export interface AppointmentButtonRowProps {
    selectedButton: number;
    setSelectedButton: (selectedButton: number) => void;
}

export const AppointmentButtonRow: React.FC<AppointmentButtonRowProps> = ({ selectedButton, setSelectedButton }) => (
  <ButtonRow disableDropdown={false}>
      <Button
          onClick={() => setSelectedButton(1)}
          disabled={selectedButton === 1}
      >
          Upcoming Appointments
      </Button>
      <Button
          onClick={() => setSelectedButton(2)}
          disabled={selectedButton === 2}
      >
          Past Appointments
      </Button>
  </ButtonRow>
);

export default AppointmentButtonRow;