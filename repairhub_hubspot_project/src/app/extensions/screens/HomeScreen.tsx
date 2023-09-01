import * as React from "react";
import {useContext, useState} from "react";
import {LoadingSpinner, Flex, Button} from "@hubspot/ui-extensions";
import {Context} from "../Context";
import {Routes, useNavigation} from "../routing/useRouting";
import AppointmentButtonRow from "../components/AppointmentButtonRow";
import UpComingAppointmentsTable from "../components/appointments/UpComingAppointmentsTable";
import PastAppointmentsTable from "../components/appointments/PastAppointmentsTable";

const HomeScreen = ({context, runServerlessFunction, actions}) => {
    const {currentUser, hubspotUser, setHubspotUser} = useContext(Context);
    const [loadingUser, setLoadingUser] = useState(false);
    const [selectedButton, setSelectedButton] = useState(1);

    const {navigateTo} = useNavigation();

    const retrieveHubUser = React.useCallback(() => {
        setLoadingUser(true);
        actions.fetchCrmObjectProperties(["hs_object_id"])
            .then(({hs_object_id}: any) => {
                runServerlessFunction({
                    name: 'getUserByHubspotUserId',
                    parameters: {hubspotUserId: hs_object_id, portalId: context.portal.id}
                }).then((resp) => {
                    if (resp.response.status === "SUCCESS") {
                        console.log(resp.response.body)
                        setHubspotUser(resp.response.body.data);
                        setLoadingUser(false);
                    } else {
                        setLoadingUser(false);
                        navigateTo(Routes.CREATE_USER)
                    }
                });
            });
    }, [runServerlessFunction, setHubspotUser]);

    React.useEffect(() => {
        retrieveHubUser();
    }, [])

    if (loadingUser) {
        return (
            <>
                <LoadingSpinner label="Retrieving User Information..." showLabel={true} layout="centered"/>
            </>
        )
    }

    return (
        <>
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
                <UpComingAppointmentsTable context={context} runServerlessFunction={runServerlessFunction} actions={actions}/>
            )}

            {selectedButton === 2 && (
                <PastAppointmentsTable/>
            )}
        </>
    );
};

export default HomeScreen;
