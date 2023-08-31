import * as React from "react";

const RouteStateContext = React.createContext<any | null>(null);

interface RouteStateProviderProps {
    state: any;
    children: React.ReactNode;
}

export const RouteStateProvider: React.FC<RouteStateProviderProps> = ({ state, children }) => {
    return (
        <RouteStateContext.Provider value={state}>
            {children}
        </RouteStateContext.Provider>
    );
};

export function useRouteState<T = any>(): T | null {
    return React.useContext(RouteStateContext);
}
