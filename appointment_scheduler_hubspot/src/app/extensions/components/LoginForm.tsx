import {Button, Form, Input} from '@hubspot/ui-extensions';
import * as React from 'react';

export const LoginForm = ({ email, setEmail, password, setPassword, onSubmit }) => (
    <Form
        onSubmit={() => onSubmit()}
        preventDefault={true}
    >
        <Input
            label="Email"
            name="email"
            tooltip="Please enter your gymsync email"
            description="Please enter your gymsync email"
            placeholder="Email"
            value={email}
            onChange={(text) => setEmail(text)}
        />
        <Input
            label="Password"
            name="password"
            tooltip="Please enter your gymsync password"
            description="Please enter your gymsync password"
            placeholder="Password"
            value={password}
            onChange={(text) => setPassword(text)}
        />
        <Button
            onClick={() => onSubmit()}
            variant="primary"
            type="submit"
        >
            Submit
        </Button>
    </Form>
)

export default LoginForm;
