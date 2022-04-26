import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {  hasAdminUser, AuthContext } from '../authContext';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { RouteLink } from '@equisoft/design-elements-react';
import ErrorBoundary from '../../components/general/error/errorBoundary';
import { APIError } from '../../lib/domain/entities/apiError';
import BasicEntity from '../../lib/domain/entities/basicEntity';
import {
    ErrorMessage,
    LoginForm,
    SignInButton,
    Wrapper,
    LoginCard,
    LoginFieldsWrapper,
    MessageAdminExistContainer
} from '../login/style';
import { Header, CustomInputText, SelectEnvironment, Footer } from "../components";

const Create = () => {
    const history = useHistory();
    const hasAdmin: boolean = hasAdminUser();
    const [loading, load] = useLoading();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [environment, setEnvironment] = useState('');

    const [environments, setEnvironments] = useState<BasicEntity[]>([]);

    const [errorMsg, setErrorMsg] = useState('');

    const { createLoggedInUser, adminEnvironments } = useContext(AuthContext);

    const validForm = userName && password && environment && confirmedPassword;

    const fetchCreateLoggedInUser = load(createLoggedInUser);
    const fetchAdminEnvironments = load(adminEnvironments);

    const submitFormCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validForm) {
            try {
                await fetchCreateLoggedInUser(userName, password, confirmedPassword, environment);
                history.push('/editor');
            } catch (error) {
                const err = (error as APIError).informations[0];
                setErrorMsg(err.message + ': ' + err.extraInformation);
                setUserName('');
                setPassword('');
                setConfirmedPassword('');
            }
        } else {
            setErrorMsg('Please fill-in all the fields');
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.value;
        setUserName(name);
        setEnvironment('');
    };

    const fetchEnvironmentsForUser = async () => {
        setEnvironments(await fetchAdminEnvironments());
    };

    return (
        <>
            <Loading loading={loading} />
            <Wrapper>
                <ErrorBoundary>
                    <Header title='Create Admin Account' />

                    {!hasAdmin ?
                        <LoginForm onSubmit={submitFormCreate}>
                            <LoginCard auth={false}>
                                {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
                                <LoginFieldsWrapper>

                                    <CustomInputText
                                        type='text'
                                        value={userName}
                                        label='Username'
                                        placeholder='Enter a username'
                                        onChange={handleNameChange}
                                        onBlur={fetchEnvironmentsForUser}
                                        className='form-content'
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

                                    <CustomInputText
                                        type='password'
                                        value={confirmedPassword}
                                        label='Confirm Password'
                                        placeholder='Confirm the password'
                                        onChange={(e) => setConfirmedPassword(e.target.value)}
                                        showIcon
                                        className='form-content'
                                    />

                                    <SelectEnvironment
                                        value={environment}
                                        label='Environment'
                                        options={environments.map((e) => ({ label: e.name, value: e.value }))}
                                        onChange={setEnvironment}
                                    />

                                    <SignInButton
                                        type="submit"
                                        buttonType='primary'
                                        disabled={!validForm}
                                    >
                                        Create admin
                                    </SignInButton>
                                </LoginFieldsWrapper>
                            </LoginCard>
                        </LoginForm>
                        :
                        <MessageAdminExistContainer>
                            Admin already exists,
                            <RouteLink routerLink={Link} href="/login" label="click here" />
                            to go to the login page
                        </MessageAdminExistContainer>
                    }
                   <Footer />
                </ErrorBoundary>
            </Wrapper>
        </>
    );
};

export default Create;
