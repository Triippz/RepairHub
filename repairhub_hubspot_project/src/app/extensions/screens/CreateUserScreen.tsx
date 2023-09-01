import * as React from "react";
import {Routes, useNavigation} from "../routing/useRouting";
import {useContext, useState} from "react";
import {Context} from "../Context";
import {Button, ErrorState, LoadingSpinner, Text} from "@hubspot/ui-extensions";

export const CreateUserScreen = ({context, runServerlessFunction, actions}) => {
    const {navigateTo} = useNavigation();
    const {setHubspotUser} = useContext(Context);
    const [errorMessage, setErrorMessage] = useState(null);

    const [creatingUser, setCreatingUser] = useState(false);


    const createSystemUser = React.useCallback(() => {
        setCreatingUser(true);
        actions.fetchCrmObjectProperties(["firstname", "lastname", "phone", "email", "hs_object_id"])
            .then(({firstname, lastname, phone, email, hs_object_id}: any) => {
                const userInfo = {
                    firstName: firstname,
                    lastName: lastname,
                    phone: phone,
                    email: email,
                    hubspotUserId: hs_object_id,
                    portalId: context.portal.id
                }

                runServerlessFunction({
                    name: 'createUser',
                    parameters: {userInfo}
                }).then((resp) => {
                    if (resp.response.status === "SUCCESS") {
                        setHubspotUser(resp.response.body.data);
                        navigateTo(Routes.HOME)
                    } else {
                        setErrorMessage(resp.response.body);
                    }
                }).catch((e) => {
                    setErrorMessage(e.message);
                })
            })
        setCreatingUser(false);

    }, [context.user.firstName, context.user.lastName, context.user.email, context.user.id, runServerlessFunction, setHubspotUser])

    if (creatingUser) {
        return (
            <>
                <LoadingSpinner label="Creating System User..." showLabel={true} layout="centered"/>
            </>
        )
    }

    return (
        <>
            <Text>
                No User was found in the RepairHub system. Please Create a new one.
            </Text>

            <Button
                onClick={() => createSystemUser()}
            >
                Create User
            </Button>

            {errorMessage && (
                <ErrorState title="Something went wrong while creating a new user in the RepairHub system.">
                    <Text>Please try again. If the problem persists, please reach out to your IT support.</Text>
                </ErrorState>
            )}
        </>
    )
}

export default CreateUserScreen;