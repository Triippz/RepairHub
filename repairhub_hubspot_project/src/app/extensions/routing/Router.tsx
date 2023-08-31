import * as React from 'react';
import {Routes} from "./useRouting";
import {RouteProps} from "./Route";



interface RouterProps {
    currentRoute: Routes;
    children: React.ReactElement<RouteProps>[] | React.ReactElement<RouteProps>;
    routeState?: any; // Add this line
}

export const Router: React.FC<RouterProps> = ({ currentRoute, routeState, children }) => {
    const routeArray = Array.isArray(children) ? children : [children];
    const route = routeArray.find(child => child.props.path === currentRoute);
    if (route) {
        return React.cloneElement(route, { routeState });
    }
    return null;
};