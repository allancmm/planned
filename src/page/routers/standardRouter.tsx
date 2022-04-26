import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '../authContext';
import RouteWithRedirect from './routeWithRedirect';

const StandardRouter = () => {
    const shouldShowLogin: boolean = isAuthenticated() === 'NO';

    const MainApp = React.lazy(() => import(/* webpackChunkName: "mainApp" */ '../app/app'));
    const Login = React.lazy(() => import(/* webpackChunkName: "login" */ '../login'));
    const Create = React.lazy(() => import(/* webpackChunkName: "create" */ '../create'));
    const PageNotFound = React.lazy(() => import(/* webpackChunkName: "pageNotFound" */ '../pageNotFound'));

    // TODO - Allan - analyse BrowserRouter to create base routes for Create and Login
    return (
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
                <Login />
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
    );
};

export default StandardRouter;
