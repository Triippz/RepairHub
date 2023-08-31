# Faux Routing System for React

This document provides a guide on how to implement and use a faux routing system in React, which mimics the behavior of `react-router` without changing the actual URL route.

## Table of Contents

- [Setup](#setup)
- [Components](#components)
    - [Router](#router)
    - [Route](#route)
- [Hooks](#hooks)
    - [useRouting](#userouting)
    - [useRouteState](#useroutestate)
- [Usage](#usage)

## Setup

First, define the route names using a TypeScript enum:

```tsx
export enum Routes {
  Home = 'home',
  About = 'about',
  Contact = 'contact'
}
```

## Components

### Router

The `Router` component is responsible for rendering the appropriate component based on the current route.

```tsx
interface RouterProps {
  currentRoute: Routes;
  children: React.ReactElement<RouteProps>[] | React.ReactElement<RouteProps>;
  routeState?: any;
}

const Router: React.FC<RouterProps> = ({ currentRoute, routeState, children }) => {
  const routeArray = Array.isArray(children) ? children : [children];
  const route = routeArray.find(child => child.props.path === currentRoute);
  if (route) {
    return React.cloneElement(route, { routeState });
  }
  return null;
};
```

### Route

The `Route` component defines the mapping between routes and components. It can also pass additional props to the rendered component.

```tsx
interface RouteProps {
  path: Routes;
  component: React.ComponentType<any>;
  routeState?: any;
  [key: string]: any;
}

const Route: React.FC<RouteProps> = ({ component: Component, routeState, ...props }) => {
  return <Component {...props} routeState={routeState} />;
};
```

## Hooks

### useRouting

The `useRouting` hook provides the current route, a function to navigate between routes, and the current route state.

```tsx
function useRouting(initialScreen: Routes = Routes.Home) {
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
```

### useRouteState

The `useRouteState` hook allows components to access the route state passed during navigation.

```tsx
const RouteStateContext = React.createContext<any | null>(null);

const RouteStateProvider: React.FC<{ state: any; children: React.ReactNode }> = ({ state, children }) => {
  return (
    <RouteStateContext.Provider value={state}>
      {children}
    </RouteStateContext.Provider>
  );
};

function useRouteState<T = any>(): T | null {
  return React.useContext(RouteStateContext);
}
```

## Usage

To use the faux routing system:

1. Set up the routes using the `Router` and `Route` components.
2. Navigate between routes using the `navigateTo` function from the `useRouting` hook.
3. Access the route state in components using the `useRouteState` hook.

Example:

```tsx
const App: React.FC = () => {
  const { currentScreen, navigateTo, routeState } = useRouting();

  return (
    <div>
      <button onClick={() => navigateTo(Routes.Home)}>Home</button>
      <button onClick={() => navigateTo(Routes.About, { from: 'Home' })}>About</button>
      <button onClick={() => navigateTo(Routes.Contact)}>Contact</button>

      <Router currentRoute={currentScreen} routeState={routeState}>
        <Route path={Routes.Home} component={HomeScreen} />
        <Route path={Routes.About} component={AboutScreen} />
        <Route path={Routes.Contact} component={ContactScreen} />
      </Router>
    </div>
  );
}
```

---

This markdown documentation provides an overview of the faux routing system, its components, hooks, and usage. You can expand on this documentation as needed, adding more details, examples, or explanations.