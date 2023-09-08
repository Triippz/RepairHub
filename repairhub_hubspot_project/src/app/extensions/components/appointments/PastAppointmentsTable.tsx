import * as React from "react";
import {Appointment} from "../../models/entities/appointment.entity";
import {Button, EmptyState, ErrorState, Flex, LoadingSpinner, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text} from "@hubspot/ui-extensions";
import {useContext} from "react";
import {Context} from "../../Context";
import {serverDateTimeToLocal} from "../../utils/date.utils";
import {enumCaseToTitleCase} from "../../utils/string.utils";
import {Routes, useNavigation} from "../../routing/useRouting";

export interface PastAppointmentsTableProps {
    runServerlessFunction: any;
    actions: any;
}

export const PastAppointmentsTable: React.FC<PastAppointmentsTableProps> = ({runServerlessFunction, actions}) => {
    const {hubspotUser} = useContext(Context);
    const {navigateTo} = useNavigation();

    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = React.useState(false);
    const [error, setError] = React.useState<string>();

    const retrieveAppointments = React.useCallback(() => {
        if (!hubspotUser) return;
        setLoadingAppointments(true);
        runServerlessFunction({
            name: 'getPastAppointments',
            parameters: {appUserId: hubspotUser.id}
        }).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setAppointments(resp.response.body);
                setError(undefined);
            } else {
                setError(resp.response.body);
            }
        });

        setLoadingAppointments(false);
    }, [runServerlessFunction, hubspotUser]);

    React.useEffect(() => {
        retrieveAppointments();
    }, [hubspotUser])

    const _renderEmptyOrErrorState = () => {
        if (error) {
            return (
                <Flex justify={"center"}>
                    <ErrorState title="Error">
                        <Text>{error}</Text>
                    </ErrorState>
                </Flex>
            );
        }

        return (
            <Flex justify={"center"}>
                <EmptyState title="No Appointments" layout="vertical" reverseOrder={true}>
                    <Text>This customer has had no previous appointments.</Text>
                </EmptyState>
            </Flex>
        );
    }

    return loadingAppointments
        ? (
            <LoadingSpinner label="Retrieving Appointments..." showLabel={true} layout="centered"/>
        )
        : (
            <>
                {appointments.length > 0
                    ? (
                        <>
                            <Table bordered={true}>
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>Type</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader>Appointment Date</TableHeader>
                                        <TableHeader>Technician</TableHeader>
                                        <TableHeader>Actions</TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.map((appointment: Appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{enumCaseToTitleCase(appointment.appointmentType)}</TableCell>
                                            <TableCell>{enumCaseToTitleCase(appointment.appointmentStatus)}</TableCell>
                                            <TableCell>{serverDateTimeToLocal(appointment?.startTime)}</TableCell>
                                            <TableCell>{appointment?.serviceTechnician?.firstName || "N/A"}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => navigateTo(Routes.VIEW_APPOINTMENT, {appointment})}>
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )
                    : _renderEmptyOrErrorState()
                }
            </>
        );
}

export default PastAppointmentsTable