import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface WithRedirectProps {
    condition: boolean;
    redirectPath: string;
}

const RouteWithRedirect = ({ condition, redirectPath, children, ...rest }: RouteProps & WithRedirectProps) =>
        <Route
            {...rest}
            render={(props) =>
                condition ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: redirectPath,
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />;

export default RouteWithRedirect;
