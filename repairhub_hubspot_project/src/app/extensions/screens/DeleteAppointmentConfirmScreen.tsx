import * as React from "react";
import {Routes, useNavigation} from "../routing/useRouting";
import {Button, ButtonRow, ErrorState, Flex, LoadingSpinner, Text} from "@hubspot/ui-extensions";
import {Appointment} from "../models/entities/appointment.entity";

export interface DeleteAppointmentConfirmProps {
    runServerlessFunction: any;
    actions: any;
}

export const DeleteAppointmentConfirmScreen: React.FC<DeleteAppointmentConfirmProps> = ({runServerlessFunction, actions}) => {
    const {navigateTo, routeState} = useNavigation();

    const appointment = routeState?.appointment as Appointment | undefined;

    const [deletingAppointment, setDeletingAppointment] = React.useState(false);
    const [error, setError] = React.useState<string>();

    const deleteAppointment = React.useCallback(() => {
        if (!appointment) return;

        setDeletingAppointment(true);
        runServerlessFunction({
            name: 'deleteAppointment',
            parameters: {appointmentId: appointment.id}
        }).then((resp) => {
            console.log(resp);
            if (resp.response.status === "SUCCESS") {
                setDeletingAppointment(resp.response.body);
                setError(undefined);

                actions.addAlert({
                    title: "The appointment has been deleted",
                    type: "success"
                });
                navigateTo(Routes.HOME);
            } else {
                setError(resp.response.body);
            }
        });

        setDeletingAppointment(false);
    }, [runServerlessFunction, appointment]);

    if (deletingAppointment) {
        return (
            <Flex direction={"column"} justify={'center'} gap={"sm"} align={"center"}>
                <LoadingSpinner label="Deleting Appointment..." showLabel={true} layout="centered"/>
            </Flex>
        )
    }

    return (
        <Flex direction={"column"} justify={'center'} gap={"sm"} align={"center"}>
            <Text
                format={{
                    fontWeight: "bold"
                }}
            >
                Are you sure you want to delete this appointment?
            </Text>

            <ButtonRow>
                <Button
                    onClick={() => navigateTo(Routes.HOME)}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => deleteAppointment()}
                    variant="destructive"
                    type="reset"
                >
                    Delete
                </Button>
            </ButtonRow>

            {error && (
                <ErrorState title="Trouble deleting appointment.">
                    <Text>
                        Please try again in a few moments.
                    </Text>
                </ErrorState>
            )}
        </Flex>
    );
}

export default DeleteAppointmentConfirmScreen;