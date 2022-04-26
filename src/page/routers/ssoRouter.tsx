import { Security } from '@okta/okta-react';
import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext, isAuthenticated } from '../authContext';
import RouteWithRedirect from './routeWithRedirect';

const SSORouter = () => {
    const shouldShowLogin: boolean = isAuthenticated() === 'NO';

    const MainApp = React.lazy(() => import(/* webpackChunkName: "mainApp" */ '../app/app'));
    const SSOLogin = React.lazy(() => import(/* webpackChunkName: "login" */ '../login/ssoLogin'));
    const Create = React.lazy(() => import(/* webpackChunkName: "create" */ '../create'));
    const PageNotFound = React.lazy(() => import(/* webpackChunkName: "pageNotFound" */ '../pageNotFound'));

    const { oktaAuth } = useContext(AuthContext);

    if (!oktaAuth) {
        toast.error('Invalid SSO configuration, cannot continue....');
        return null;
    }

    // TODO - Allan - analyse BrowserRouter to create base routes for Create and SSOLogin
    // Do not exit if okta session expires, only Design session matters. Okta is only used to create our own session
    return (
        <Security oktaAuth={oktaAuth}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/login" />} />

                <Route exact path="/create-admin">
                    <Create />
                </Route>

                <RouteWithRedirect
                    condition={shouldShowLogin}
                    redirectPath='/editor'
                    path="/login"
                >
                    <SSOLogin />
                </RouteWithRedirect>
                <RouteWithRedirect
                    condition={!shouldShowLogin}
                    redirectPath='/login'
                    path="/editor"
                >
                    <MainApp />
                </RouteWithRedirect>

                <Route component={PageNotFound} />
            </Switch>
        </Security>
    );
};

export default SSORouter;
