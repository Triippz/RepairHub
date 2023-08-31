import * as React from "react";
import {
    hubspot,
} from '@hubspot/ui-extensions';
import MainScreen from "./screens/MainScreen";
import {Context, ContextProvider} from "./Context";
import {useContext} from "react";
import UnAuthenticatedScreen from "./screens/UnAuthenticatedScreen";
import useRouting from "./routing/useRouting";

const Entry = ({context, runServerlessFunction, actions}) => {
    const { currentUser, setCurrentUser } = useContext(Context);
    const { currentScreen, navigateTo, routeState } = useRouting();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [authenticationError, setAuthenticationError] = React.useState(null);


    const getCurrentUser = React.useCallback(() => {
        setIsLoading(true);
        runServerlessFunction({name: 'getCurrentUser'}).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setCurrentUser(resp.response.body);
                setIsAuthenticated(true);
            } else {
                console.log(resp.response)
                setIsAuthenticated(false);
                setAuthenticationError(resp.response.body.message);
            }
        });
        setIsLoading(false);
    },[runServerlessFunction]);

    React.useEffect(() => {
        getCurrentUser();
    }, []);

    if (!isAuthenticated) {
        return (
            <UnAuthenticatedScreen
                isLoading={isLoading}
                context={context}
                refreshUser={() => getCurrentUser()}
                errorMessage={authenticationError}
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
