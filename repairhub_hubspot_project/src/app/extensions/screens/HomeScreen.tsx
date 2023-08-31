import * as React from "react";
import {useContext, useState} from "react";
import {Button, Divider, Input, Link, LoadingSpinner, Stack, Text} from "@hubspot/ui-extensions";
import {Context} from "../Context";
import {Routes, useNavigation} from "../routing/useRouting";

const HomeScreen = ({context, runServerlessFunction, actions}) => {
    const {currentUser, hubspotUser, setHubspotUser} = useContext(Context);
    const [loadingUser, setLoadingUser] = useState(false);

    const {navigateTo} = useNavigation();

    const retrieveHubUser = React.useCallback(() => {
        setLoadingUser(true);
        runServerlessFunction({
            name: 'getUserByHubspotUserId',
            parameters: {hubspotUserId: context.user.id}
        }).then((resp) => {
            console.log("response", resp.response)
            if (resp.response.status === "SUCCESS") {
                setHubspotUser(resp.response.body.data);
                setLoadingUser(false);
            } else {
                setLoadingUser(false);
                navigateTo(Routes.CREATE_USER)
            }
        });
    }, [runServerlessFunction, setHubspotUser]);



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
            <>
                <Text>User Details</Text>
            </>
        </>
    );
};

export default HomeScreen;
