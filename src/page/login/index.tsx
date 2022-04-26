import React, { MouseEvent, useContext, useState } from 'react';
import { Loading, useLoading } from "equisoft-design-ui-elements";
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import ErrorBoundary from '../../components/general/error/errorBoundary';
import { defaultAuthService } from '../../lib/context';
import { APIError } from '../../lib/domain/entities/apiError';
import BasicEntity from '../../lib/domain/entities/basicEntity';
import AuthService from '../../lib/services/authService';
import { AuthContext } from '../authContext';
import {Header, Footer, SelectEnvironment, CustomInputText} from "../components";
import {
    AuthIcon,
    AuthMessage,
    ErrorMessage,
    LoginCard,
    LoginFieldsWrapper,
    LoginForm,
    LoginWidget,
    SignInButton,
    Wrapper,
} from './style';

const Login = ({ authService }: { authService: AuthService }) => {

    const [loading, load] = useLoading();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [environment, setEnvironment] = useState('');
    const [environments, setEnvironments] = useState<BasicEntity[]>([]);

    const [errorMsg, setErrorMsg] = useState('');

    const [authSuccess, setAuthSuccess] = useState(false);

    const { login, loginEnvironments } = useContext(AuthContext);

    const fetchLogin = load(authService.login);
    const fetchEnvironments = load(loginEnvironments);
    const fetchRealLogin = load(login);

    const preAuthorize = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (userName && password) {
            try {
                await fetchLogin(userName, password, '');
                await fetchEnvironmentsForUser();
                setAuthSuccess(true);
                setErrorMsg('');
                return;
            } catch (error) {
                const err = (error as APIError).informations[0];
                setErrorMsg(err.message + ': ' + err.extraInformation);
                setUserName('');
                setPassword('');
            }
        } else {
            setErrorMsg('Please fill-in all the fields');
        }
        setAuthSuccess(false);
    };
    const doRealLogin = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (environment) {
            try {
                await fetchRealLogin(userName, password, environment);
            } catch (error) {
                const err = (error as APIError).informations[0];
                setErrorMsg(err.message + ': ' + err.extraInformation);
            }
        } else {
            setErrorMsg('Please select the environment');
        }
    };

    const handleNameChange = (name: string) => {
        setUserName(name);
        setEnvironment('');
    };

    const fetchEnvironmentsForUser = async () => {
        const newEnvs = await fetchEnvironments(userName);
        setEnvironments(newEnvs);
    };

    return (
        <Wrapper>
            <ErrorBoundary>
                <Loading loading={loading} />
                <Header title='Sign In' />

                <LoginForm>
                    <LoginCard auth={!authSuccess}>
                        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
                        { !authSuccess ?
                            <LoginWidget>
                                <LoginFieldsWrapper>
                                    <CustomInputText
                                        type='text'
                                        value={userName}
                                        label='Username'
                                        placeholder='Enter a username'
                                        onChange={(e) =>
                                            handleNameChange(e.target.value)}
                                        className='form-content'
                                        autoFocus
                                    />

                                    <CustomInputText
                                        type='password'
                                        value={password}
                                        label='Password'
                                        placeholder='Enter a password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        showIcon
                                        className='form-content'
                                    />

                                </LoginFieldsWrapper>
                                <SignInButton type="submit" buttonType='primary' onClick={preAuthorize}>
                                    Connect
                                </SignInButton>
                            </LoginWidget>
                         :
                        <>
                            <AuthMessage>
                                <AuthIcon icon={faCheckCircle} /> Authorized as {userName}
                            </AuthMessage>

                            <SelectEnvironment
                                value={environment}
                                label='Environment'
                                options={environments.map((e) => ({ label: e.name, value: e.value }))}
                                onChange={setEnvironment}
                            />

                            <SignInButton
                                type="submit"
                                buttonType='primary'
                                disabled={!environment}
                                onClick={doRealLogin}
                            >
                                Enter
                            </SignInButton>
                        </>}
                    </LoginCard>
                </LoginForm>
                <Footer />
            </ErrorBoundary>
        </Wrapper>
    );
};

Login.defaultProps = {
    authService: defaultAuthService,
};

export default Login;
