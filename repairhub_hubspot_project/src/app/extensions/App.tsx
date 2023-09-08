import * as React from "react";
import {useContext} from "react";
import {hubspot,} from '@hubspot/ui-extensions';
import {Context, ContextProvider} from "./Context";
import UnAuthenticatedScreen from "./screens/UnAuthenticatedScreen";
import useRouting, {Routes} from "./routing/useRouting";
import {Router} from "./routing/Router";
import {Route} from "./routing/Route";
import HomeScreen from "./screens/HomeScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import EditAppointmentScreen from "./screens/EditAppointmentScreen";
import ViewAppointmentScreen from "./screens/ViewAppointmentScreen";
import DeleteAppointmentConfirmScreen from "./screens/DeleteAppointmentConfirmScreen";
import CreateAppointmentScreen from "./screens/CreateAppointmentScreen";

const Entry = ({context, runServerlessFunction, actions}) => {
    const { setHubspotUser } = useContext(Context);
    const { currentScreen, navigateTo, RoutingProvider } = useRouting();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [authenticationError, setAuthenticationError] = React.useState(null);


    const getCurrentUser = React.useCallback(() => {
        setIsLoading(true);
        actions.fetchCrmObjectProperties(["hs_object_id"])
            .then(({hs_object_id}: any) => {
                if (!hs_object_id && !context.portal.id) {
                    setIsLoading(false);
                }

                runServerlessFunction({
                    name: 'getUserByHubspotUserId',
                    parameters: {hubspotUserId: hs_object_id, portalId: context.portal.id}
                }).then((resp) => {
                    if (resp.response.status === "SUCCESS") {
                        setHubspotUser(resp.response.body);
                        setIsAuthenticated(true);
                        setIsLoading(false)
                        navigateTo(Routes.HOME)
                    } else {
                        setIsLoading(false);
                        setIsAuthenticated(false);
                        setAuthenticationError(resp.response.body.message);
                    }
                });
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
                <Route
                    path={Routes.EDIT_APPOINTMENT}
                    component={EditAppointmentScreen}
                    context={context}
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
                <Route
                    path={Routes.SCHEDULE_APPOINTMENT}
                    component={CreateAppointmentScreen}
                    context={context}
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
                <Route
                    path={Routes.VIEW_APPOINTMENT}
                    component={ViewAppointmentScreen}
                    context={context}
                    runServerlessFunction={runServerlessFunction}
                    actions={actions}
                />
                <Route
                    path={Routes.DELETE_APPOINTMENT}
                    component={DeleteAppointmentConfirmScreen}
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
