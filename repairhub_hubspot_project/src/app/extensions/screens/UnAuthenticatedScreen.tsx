import * as React from "react";
import {Button, LoadingSpinner, Text} from "@hubspot/ui-extensions";

const UnAuthenticatedScreen = ({context, refreshUser, errorMessage = undefined, isLoading = false}) => {
    return (
        <>
            {isLoading ? (
                <LoadingSpinner label="Signing In"/>
            ) : (
                <>
                    <Text format={{fontWeight: 'bold'}}>
                        You are not logged in, please login to continue
                    </Text>
                    <Button onClick={() => refreshUser()}>Login</Button>

                    {
                        errorMessage && (
                            <Text variant="danger">{errorMessage}</Text>
                        )
                    }
                </>
            )}

        </>
    )
        ;
};

export default UnAuthenticatedScreen;