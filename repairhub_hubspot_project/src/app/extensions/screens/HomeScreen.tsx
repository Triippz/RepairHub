import * as React from "react";
import {useState} from "react";
import {LoadingSpinner, Flex, Button} from "@hubspot/ui-extensions";
import {Routes, useNavigation} from "../routing/useRouting";
import AppointmentButtonRow from "../components/AppointmentButtonRow";
import UpComingAppointmentsTable from "../components/appointments/UpComingAppointmentsTable";
import PastAppointmentsTable from "../components/appointments/PastAppointmentsTable";

const HomeScreen = ({context, runServerlessFunction, actions}) => {
    const [loadingUser, setLoadingUser] = useState(false);
    const [selectedButton, setSelectedButton] = useState(1);

    const {navigateTo} = useNavigation();

    if (loadingUser) {
        return (
            <>
                <LoadingSpinner label="Retrieving User Information..." showLabel={true} layout="centered"/>
            </>
        )
    }

    return (
        <Flex
            direction={"column"}
            justify={"start"}
            gap={"small"}
        >
            <Flex justify="between">
                <AppointmentButtonRow setSelectedButton={setSelectedButton} selectedButton={selectedButton}/>

                <Button
                    onClick={() => navigateTo(Routes.SCHEDULE_APPOINTMENT)}
                    variant="primary"
                >
                    Schedule Appointment
                </Button>
            </Flex>

            {selectedButton === 1 && (
                <UpComingAppointmentsTable
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
            )}

            {selectedButton === 2 && (
                <PastAppointmentsTable
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
            )}
        </Flex>
    );
};

export default HomeScreen;
