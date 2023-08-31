import * as React from "react";
import {createContext, useContext, useState} from 'react';

export enum Routes {
    HOME = 'home',
    CREATE_USER = 'create_user',
    LOGIN = 'login',
}

interface RoutingContextType {
    navigateTo: (route: Routes, state?: any) => void;
    currentScreen: Routes;
    routeState: any;
}

const RoutingContext = createContext<RoutingContextType | undefined>(undefined);


function useRouting(initialScreen: Routes = Routes.LOGIN) {
    const [currentScreen, setCurrentScreen] = useState<Routes>(initialScreen);
    const [routeState, setRouteState] = useState<any>(null);

    const navigateTo = (screen: Routes, state?: any) => {
        setCurrentScreen(screen);
        setRouteState(state);
    };

    return {
        currentScreen,
        navigateTo,
        routeState,
        RoutingProvider: ({ children }: { children: React.ReactNode }) => (
            <RoutingContext.Provider value={{ navigateTo, currentScreen, routeState }}>
                {children}
            </RoutingContext.Provider>
        )
    };
}


export function useNavigation() {
    const context = useContext(RoutingContext);
    if (!context) {
        throw new Error("useNavigation must be used within a RoutingProvider");
    }
    return context;
}

export default useRouting;
