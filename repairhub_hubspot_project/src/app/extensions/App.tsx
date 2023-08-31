import * as React from "react";
import {useContext} from "react";
import {hubspot,} from '@hubspot/ui-extensions';
import MainScreen from "./screens/HomeScreen";
import {Context, ContextProvider} from "./Context";
import UnAuthenticatedScreen from "./screens/UnAuthenticatedScreen";
import useRouting, {Routes} from "./routing/useRouting";
import {Router} from "./routing/Router";
import {Route} from "./routing/Route";
import HomeScreen from "./screens/HomeScreen";
import CreateUserScreen from "./screens/CreateUserScreen";

const Entry = ({context, runServerlessFunction, actions}) => {
    const { setCurrentUser } = useContext(Context);
    const { currentScreen, navigateTo, RoutingProvider } = useRouting();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [authenticationError, setAuthenticationError] = React.useState(null);


    const getCurrentUser = React.useCallback(() => {
        setIsLoading(true);
        runServerlessFunction({name: 'getCurrentUser'}).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setCurrentUser(resp.response.body);
                setIsAuthenticated(true);
                navigateTo(Routes.HOME)
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
        <RoutingProvider>
            <Router currentRoute={currentScreen}>
                <Route
                    path={Routes.HOME}
                    component={HomeScreen}
                    context={context}
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
                <Route
                    path={Routes.CREATE_USER}
                    component={CreateUserScreen}
                    context={context}
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
            </Router>
        </RoutingProvider>
    )
}

hubspot.extend(({context, runServerlessFunction, actions}: any) => (
    <ContextProvider>
        <Entry context={context} runServerlessFunction={runServerlessFunction} actions={actions}/>
    </ContextProvider>
));
