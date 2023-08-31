import {Routes} from "./useRouting";
import * as React from "react";
import {RouteStateProvider} from "./useRouteState";

export interface RouteProps {
    path: Routes;
    component: React.ComponentType<any>;
    routeState?: any;
    [key: string]: any;
}

export const Route: React.FC<RouteProps> = ({ component: Component, routeState, ...props }) => {
    return (
        <RouteStateProvider state={routeState}>
            <Component {...props} />
        </RouteStateProvider>
    );
};