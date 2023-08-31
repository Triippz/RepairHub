import { useState } from 'react';

export enum Routes {
    HOME = 'home',
    CREATE_USER = 'create_user',
    LOGIN = 'login',
}

function useRouting(initialScreen: Routes = Routes.HOME) {
    const [currentScreen, setCurrentScreen] = useState<Routes>(initialScreen);
    const [routeState, setRouteState] = useState<any>(null);

    const navigateTo = (screen: Routes, state?: any) => {
        setCurrentScreen(screen);
        setRouteState(state);
    };

    return {
        currentScreen,
        navigateTo,
        routeState
    };
}


export default useRouting;
