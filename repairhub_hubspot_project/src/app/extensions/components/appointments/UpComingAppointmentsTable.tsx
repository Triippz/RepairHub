import * as React from "react";
import {Appointment} from "../../entities/appointment.entity";

export interface UpComingAppointmentsTableProps {
    context: any;
    runServerlessFunction: any;
    actions: any;
}

// Whatever not gonna make this a dumb component
export const UpComingAppointmentsTable: React.FC<UpComingAppointmentsTableProps> = ({context, runServerlessFunction, actions}) => {
    const {hubspotUser} = context;
    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = React.useState(false);

    const retrieveAppointments = React.useCallback(() => {
        setLoadingAppointments(true);
        console.log(hubspotUser)
        runServerlessFunction({
            name: 'getUserByHubspotUserId',
            parameters: {appUserId: hubspotUser.id}
        }).then((resp) => {
            console.log(resp.response.body)
            if (resp.response.status === "SUCCESS") {
                setAppointments(resp.response.body.data.appointments);
            } else {
                console.log(resp.response.body);
            }
        });

        setLoadingAppointments(false);
    }, [runServerlessFunction, hubspotUser]);

    React.useEffect(() => {
        retrieveAppointments();
    }, [])

    return (
        <>
        </>
    );
}

export default UpComingAppointmentsTable;