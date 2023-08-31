# Faux Routing System with Authentication for React

This document provides a guide on implementing a faux routing system in React that mimics the behavior of `react-router` without changing the actual URL route. Additionally, it includes authentication logic and ensures that all screens have access to specific props.

## Table of Contents

- [Setup](#setup)
- [Components](#components)
  - [Router](#router)
  - [Route](#route)
  - [LoginScreen](#loginscreen)
- [Hooks](#hooks)
  - [useRouting](#userouting)
- [Usage](#usage)
- [Passing Props to All Screens](#passing-props-to-all-screens)

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

The `Router` component is responsible for rendering the appropriate component based on the current route and authentication status.

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

The `Route` component defines the mapping between routes and components. It also ensures that specific props (`context`, `runServerlessFunction`, and `actions`) are passed to every screen.

```tsx
interface RouteProps {
  path: Routes;
  component: React.ComponentType<any>;
  context: any;
  runServerlessFunction: any;
  actions: any;
  routeState?: any;
  [key: string]: any;
}

const Route: React.FC<RouteProps> = ({ 
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
```

### LoginScreen

The `LoginScreen` component provides a way for users to authenticate.

```tsx
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div>
      <h1>Login</h1>
      {/* Add your login form and logic here */}
      <button onClick={onLogin}>Login</button>
    </div>
  );
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

## Usage

To use the faux routing system:

1. Set up the routes using the `Router` and `Route` components.
2. Navigate between routes using the `navigateTo` function from the `useRouting` hook.
3. Handle authentication using the `LoginScreen` component and the `isAuthenticated` state.

Example:

```tsx
const App: React.FC = ({ context, runServerlessFunction, actions }) => {
  const { currentScreen, navigateTo } = useRouting();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigateTo(Routes.Home);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Navigation buttons */}
      <button onClick={() => navigateTo(Routes.Home)}>Home</button>
      <button onClick={() => navigateTo(Routes.About)}>About</button>
      <button onClick={() => navigateTo(Routes.Contact)}>Contact</button>

      {/* Router with Route components */}
      <Router currentRoute={currentScreen}>
        <Route 
          path={Routes.Home} 
          component={HomeScreen} 
          context={context} 
          runServerlessFunction={runServerlessFunction} 
          actions={actions}
        />
        <Route 
          path={Routes.About} 
          component={AboutScreen} 
          context={context} 
          runServerlessFunction={runServerlessFunction} 
          actions={actions}
        />
        <Route 
          path={Routes.Contact} 
          component={ContactScreen} 
          context={context} 
          runServerlessFunction={runServerlessFunction} 
          actions={actions}
        />
      </Router>
    </div>
  );
};
```

## Passing Props to All Screens

With the current setup, every screen rendered by the `Route` component will receive the three props (`context`, `runServerlessFunction`, and `actions`). You can use these props directly within each screen component as needed.
