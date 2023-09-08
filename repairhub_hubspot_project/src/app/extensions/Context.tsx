import * as React from "react";
import {useState} from "react";
import {User} from "./models/entities/user.entity";

export const Context = React.createContext({
    currentUser: null,
    setCurrentUser: (user: User) => {},
    hubspotUser: null,
    setHubspotUser: (user: User) => {}
});

export const ContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [hubspotUser, setHubspotUser] = useState<User>();

    return (
        <Context.Provider
            value={{currentUser, setCurrentUser, hubspotUser, setHubspotUser}}>
            {children}
        </Context.Provider>
    );
};
