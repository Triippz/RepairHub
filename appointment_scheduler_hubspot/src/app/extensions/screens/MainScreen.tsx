import * as React from "react";
import {useContext, useState} from "react";
import {Button, Divider, Input, Link, LoadingSpinner, Stack, Text} from "@hubspot/ui-extensions";
import {Context} from "../Context";

const MainScreen = ({context, runServerless, sendAlert, fetchCrmObjectProperties}) => {
    const {currentUser, accessToken, hubspotUser, setHubspotUser} = useContext(Context);
    const [loadingUser, setLoadingUser] = useState(false);

    const retrieveHubUser = React.useCallback(() => {
        setLoadingUser(true);
        runServerless({
            name: 'getUserByHubspotUserId',
            parameters: {accessToken, hubspotUserId: context.user.id}
        }).then((resp) => {
            console.log(resp)
            if (resp.status === "SUCCESS") {
                setHubspotUser(resp.body);
                setLoadingUser(false);
            } else {
                sendAlert({message: resp.message});
                setLoadingUser(false);
            }
        });
    }, [runServerless, setHubspotUser, sendAlert]);

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
            <Text>
                <Text format={{fontWeight: 'bold'}}>
                    Your first UI extension is ready!
                </Text>
                Congratulations, {context.user.id}! You just deployed your first
                HubSpot UI extension. This example demonstrates how you would send
                parameters from your React frontend to the serverless function and get a
                response back.
            </Text>
            <Divider/>
            <Stack>
                <Text>
                    What now? Explore all available{' '}
                    <Link href="https://developers.hubspot.com/docs/platform/ui-extension-components">
                        UI components
                    </Link>
                    , get an overview of{' '}
                    <Link href="https://developers.hubspot.com/docs/platform/ui-extensions-overview">
                        UI extensions
                    </Link>
                    , learn how to{' '}
                    <Link href="https://developers.hubspot.com/docs/platform/create-ui-extensions">
                        add a new custom card
                    </Link>
                    , jump right in with our{' '}
                    <Link href="https://developers.hubspot.com/docs/platform/ui-extensions-quickstart">
                        Quickstart Guide
                    </Link>
                    , or check out our{' '}
                    <Link href="https://github.com/HubSpot/ui-extensions-react-examples">
                        code Samples
                    </Link>
                    .
                </Text>
            </Stack>
        </>
    );
};

export default MainScreen;
