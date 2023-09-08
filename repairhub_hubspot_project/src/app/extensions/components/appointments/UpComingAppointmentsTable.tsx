import * as React from "react";
import {useContext} from "react";
import {Appointment, AppointmentStatus} from "../../models/entities/appointment.entity";
import {
    Button,
    EmptyState,
    ErrorState,
    Flex,
    LoadingSpinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Text
} from "@hubspot/ui-extensions";
import {Context} from "../../Context";
import {serverDateTimeToLocal} from "../../utils/date.utils";
import {enumCaseToTitleCase} from "../../utils/string.utils";
import {Routes, useNavigation} from "../../routing/useRouting";

export interface UpComingAppointmentsTableProps {
    runServerlessFunction: any;
    actions: any;
}

export const UpComingAppointmentsTable: React.FC<UpComingAppointmentsTableProps> = ({runServerlessFunction, actions}) => {
    const {hubspotUser} = useContext(Context);
    const {navigateTo} = useNavigation();
    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = React.useState(false);
    const [error, setError] = React.useState<string>();

    const onNavigate = (screen: Routes, state?: any) => {
        navigateTo(screen, state);
    }

    const retrieveAppointments = React.useCallback(() => {
        if (!hubspotUser) return;

        setLoadingAppointments(true);
        runServerlessFunction({
            name: 'getUpcomingAppointments',
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
                    <Text>There are no upcoming appointments for this user.</Text>
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
                                                {appointment.appointmentStatus !== AppointmentStatus.IN_PROGRESS && (
                                                    <>
                                                        <Button onClick={() => onNavigate(Routes.EDIT_APPOINTMENT, {appointment})}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => onNavigate(Routes.DELETE_APPOINTMENT, {appointment})}
                                                            variant="destructive"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                                {appointment.appointmentStatus === AppointmentStatus.IN_PROGRESS && (
                                                    <Button onClick={() => onNavigate(Routes.VIEW_APPOINTMENT, {appointment})}>
                                                        View
                                                    </Button>
                                                )}
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

export default UpComingAppointmentsTable;