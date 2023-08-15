import * as React from "react";
import {
    hubspot,
} from '@hubspot/ui-extensions';
import MainScreen from "./screens/MainScreen";
import LoginScreen from "./screens/LoginScreen";
import {Context, ContextProvider} from "./Context";
import {useContext} from "react";

const Entry = ({context, runServerlessFunction, actions}) => {
    const { currentUser, setCurrentUser, accessToken, setAccessToken } = useContext(Context);

    if (!currentUser) {
        return (
            <LoginScreen
                context={context}
                runServerless={runServerlessFunction}
                sendAlert={actions.addAlert}
                setAuthenticatedUser={setCurrentUser}
                accessToken={accessToken}
                setAuthCredentials={setAccessToken}
            />
        )
    }

    return (
        <MainScreen
            context={context}
            runServerless={runServerlessFunction}
            sendAlert={actions.addAlert}
            fetchCrmObjectProperties={actions.fetchCrmObjectProperties}
        />
    )
}

hubspot.extend(({context, runServerlessFunction, actions}: any) => (
    <ContextProvider>
        <Entry context={context} runServerlessFunction={runServerlessFunction} actions={actions}/>
    </ContextProvider>
));
