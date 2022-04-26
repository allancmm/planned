import { Loading } from 'equisoft-design-ui-elements';
import 'equisoft-design-ui-elements/dist/styles.css';
import localforage from 'localforage';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reflect-metadata';
import { LoginType } from '../lib/domain/entities/authData';
import AuthProvider, { useContextPath, useLoginType } from './authContext';
import './i18n';
import SSORouter from './routers/ssoRouter';
import StandardRouter from './routers/standardRouter';
import { DesignSystem } from '@equisoft/design-elements-react';

const App = () => {
    toast.configure({ theme: 'colored',
                            autoClose: 10000,
                            draggable: false,
                            closeOnClick: false,
                            position: toast.POSITION.BOTTOM_RIGHT,
                            style: { width: 380, zIndex: 999999  } });
    localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'EquisoftDesign',
        version: 1.0,
        storeName: 'cache',
        description: 'used to persist client-side data, such as settings, but also current state for app reloads',
    });

    return (
        <React.Suspense fallback={<Loading />}>
            <AuthProvider>
                <DesignSystem>
                    <AppRouter />
                </DesignSystem>
            </AuthProvider>
        </React.Suspense>
    );
};

const AppRouter = () => {
    const contextPath: string = useContextPath();
    const loginType: LoginType = useLoginType();

    return contextPath ? (
        // TODO - Allan - add page not found route
        <Router basename={`${contextPath}/react`}>{loginType === 'SSO' ? <SSORouter /> : <StandardRouter />}</Router>
    ) : (
        <Loading />
    );
};

export default App;
