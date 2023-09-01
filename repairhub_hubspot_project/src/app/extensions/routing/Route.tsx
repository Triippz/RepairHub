import {Routes} from "./useRouting";
import * as React from "react";

export interface RouteProps {
    path: Routes;
    component: React.ComponentType<any>;
    context: any;
    runServerlessFunction: any;
    actions: any;
    routeState?: any;
    [key: string]: any;
}

export const Route: React.FC<RouteProps> = ({
     component: Component,
     context,
     runServerlessFunction,
     actions,
     routeState,
     ...props
 }) => {
    return (
        <Component
            {...props}
            context={context}
            runServerlessFunction={runServerlessFunction}
            actions={actions}
            routeState={routeState}
        />
    );
};