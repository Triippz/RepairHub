import * as React from "react";
import {useContext, useState} from "react";
import {Button, Divider, Input, Link, LoadingSpinner, Stack, Text} from "@hubspot/ui-extensions";
import {Context} from "../Context";

const MainScreen = ({context, runServerless, sendAlert, fetchCrmObjectProperties}) => {
    const {currentUser, accessToken, hubspotUser, setHubspotUser} = useContext(Context);
    const [loadingUser, setLoadingUser] = useState(false);

    const retrieveHubUser = React.useCallback(() => {
        console.log(context.user)
        setLoadingUser(true);
        runServerless({
            name: 'getUserByHubspotUserId',
            parameters: {accessToken, hubspotUserId: context.user.id}
        }).then((resp) => {
            console.log("response", resp.response)
            if (resp.response.status === "SUCCESS") {
                setHubspotUser(resp.response.body.data);
                setLoadingUser(false);
            } else {
                setLoadingUser(false);
            }
        });
    }, [runServerless, setHubspotUser]);

    const createSystemUser = React.useCallback(() => {
        const userInfo = {
            firstName: context.user.firstName,
            lastName: context.user.lastName,
            email: context.user.email,
            hubspotUserId: context.user.id
        }

        runServerless({
            name: 'createUser',
            parameters: {accessToken, hubspotUserId: userInfo}
        }).then((resp) => {
            console.log("response", resp.response)
            if (resp.response.status === "SUCCESS") {
                setHubspotUser(resp.response.body.data);
                setLoadingUser(false);
            } else {
                setLoadingUser(false);
            }
        });
    }, [context.user.firstName, context.user.lastName, context.user.email, context.user.id, runServerless, setHubspotUser])

    React.useEffect(() => {
        retrieveHubUser();
    }, [])

    if (loadingUser) {
        return (
            <>
                <LoadingSpinner label="Retrieving User Information..." />
            </>
        )
    }

    return (
        <>
            {hubspotUser
                ? (
                    <>
                        <Text>User Details</Text>
                    </>
                )
                : (
                    <>
                        <Text>
                            No User was found in the RepairHub system. Please Create a new one.
                        </Text>

                        <Button>Create User</Button>
                    </>
                )
            }
        </>
    );
};

export default MainScreen;
