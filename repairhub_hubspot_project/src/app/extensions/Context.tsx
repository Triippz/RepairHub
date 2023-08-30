import * as React from "react";
import {useState} from "react";
import {User} from "./entities/user.entity";

export const Context = React.createContext();
export const ContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [accessToken, setAccessToken] = useState<string>();
    const [hubspotUser, setHubspotUser] = useState<User>();

    return (
        <Context.Provider
            value={{currentUser, setCurrentUser, accessToken, setAccessToken, hubspotUser, setHubspotUser}}>
            {children}
        </Context.Provider>
    );
};
