import * as React from "react";
import {useState} from "react";
import {Text} from "@hubspot/ui-extensions";
import LoginForm from "../components/LoginForm";

const LoginScreen = ({context, runServerless, sendAlert, setAuthenticatedUser, setAuthCredentials, accessToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const getAuthenticatedUser = React.useCallback((accessToken) => {
        runServerless({name: 'getCurrentUser', parameters: {accessToken}}).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setAuthenticatedUser(resp.response.body);
                sendAlert({message: "You have successfully logged in"});
            } else {
                console.log(resp.response)
                sendAlert({
                    type: "danger",
                    message: resp.response.body.message
                });
            }
        });
    },[runServerless, setAuthenticatedUser, sendAlert]);

    const onLoginUser = React.useCallback(() => {
        if (!email || !password) {
            sendAlert({message: "Please enter a username and password"});
            return;
        }

        runServerless({name: 'userLogin', parameters: {email, password}}).then((resp) => {
            if (resp.response.status === "SUCCESS") {
                setAuthCredentials(resp.response.body.token);
                getAuthenticatedUser(resp.response.body.token);
            } else {
                sendAlert({
                    type: "danger",
                    message: resp.response.body.message
                });
            }
        });
    }, [email, password, sendAlert, runServerless, setAuthCredentials]);

    return (
        <>
            <Text format={{fontWeight: 'bold'}}>
                Please Login to your Gym Sync Staff Account
            </Text>

            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={() => onLoginUser()}
            />
        </>
    );
};

export default LoginScreen;
