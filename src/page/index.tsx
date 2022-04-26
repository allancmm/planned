import { Loading } from 'equisoft-design-ui-elements';
import 'equisoft-design-ui-elements/dist/styles.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reflect-metadata';
import AuthProvider, { useContextPath } from './authContext';
import StandardRouter from './routers/standardRouter';
import { DesignSystem } from '@equisoft/design-elements-react';

const App = () => {
    toast.configure({ theme: 'colored',
                            autoClose: 10000,
                            draggable: false,
                            closeOnClick: false,
                            position: toast.POSITION.BOTTOM_RIGHT,
                            style: { width: 380, zIndex: 999999  } });
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

    return contextPath ? (
        <Router basename={`${contextPath}/react`}><StandardRouter /></Router>
    ) : (
        <Loading />
    );
};

export default App;
