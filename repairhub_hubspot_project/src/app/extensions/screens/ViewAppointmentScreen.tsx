import * as React from "react";
import {Routes, useNavigation} from "../routing/useRouting";
import {Flex, Text} from "@hubspot/ui-extensions";
import BreadCrumbs from "../components/BreadCrumbs";
import {Appointment} from "../models/entities/appointment.entity";

export interface ViewAppointmentProps {
    runServerlessFunction: any;
    actions: any;
}

export const ViewAppointmentScreen: React.FC<ViewAppointmentProps> = ({runServerlessFunction, actions}) => {
    const {navigateTo, routeState} = useNavigation();

    const appointment = routeState?.appointment as Appointment | undefined;

    return (
        <Flex direction={"column"} justify={'start'} gap={"sm"}>
            <BreadCrumbs
                crumbs={[
                    {label: "Home", screen: Routes.HOME, active: false},
                    {label: "View Appointment", screen: null, active: true}
                ]}
            />

            <Text>View Appointment</Text>
        </Flex>
    );
}

export default ViewAppointmentScreen;