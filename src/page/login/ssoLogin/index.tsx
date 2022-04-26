import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useOktaAuth } from '@okta/okta-react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import ErrorBoundary from '../../../components/general/error/errorBoundary';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import { AuthContext, useSSOConfig } from '../../authContext';
import {
    AuthIcon,
    AuthMessage,
    EnvSelector,
    LoginCard,
    LoginForm,
    LoginWidget,
    SignInButton,
    Wrapper,
} from '../style';
import { Header, SelectEnvironment, Footer } from "../../components";
import { Loading, useLoading } from "equisoft-design-ui-elements";

const ID_OKTA_WIDGET = 'sign-in-widget';

const SSOLogin = () => {
    const { oktaAuth } = useOktaAuth();
    const ssoConfig = useSSOConfig();
    const [loading, load] = useLoading();

    const { loginEnvironments, loginSSO } = useContext(AuthContext);
    const [environments, setEnvironments] = useState<BasicEntity[]>([]);
    const [environment, setEnvironment] = useState('');

    const [authorizedUserName, setAuthorizedUserName] = useState<string>();
    const [authSuccess, setAuthSuccess] = useState(false);

    const validForm = authorizedUserName && environment;

    const fetchEnvironmentsForUser = load(async (userName: string) => {
        const newEnvs = await loginEnvironments(userName);
        setEnvironments(newEnvs);
    })

    const fetchForUser = async (username: string) => {
        setAuthorizedUserName(username);
        await fetchEnvironmentsForUser(username);
    };

    const submitFormLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validForm) {
            await load(async () => loginSSO(oktaAuth.getIdToken() ?? '', environment))();
        }
    };

    useEffect(() => {
        oktaAuth.isAuthenticated().then((b) => {
            setAuthSuccess(b);
            if (b) {
                oktaAuth.getUser().then((u) => fetchForUser(u.preferred_username ?? ''));
            }
        });
    }, [oktaAuth]);


    useEffect(() => {
        const { issuer, clientId, redirectUri, scopes } = oktaAuth.options;
        const widget = new OktaSignIn({
            baseUrl: ssoConfig?.baseUrl,
            clientId,
            redirectUri,
            authParams: {
                issuer,
                scopes,
            },
            features: {
                showPasswordToggleOnSignInPage: true,
            },
        });

        widget.renderEl(
            { el: `#${ID_OKTA_WIDGET}` },
            async ({ tokens }: any) => {
                // Add tokens to storage
                const tokenManager = oktaAuth.tokenManager;
                tokenManager.setTokens({ idToken: tokens.idToken, accessToken: tokens.accessToken });

                const user = await oktaAuth.getUser();
                setAuthorizedUserName(user.preferred_username);
                fetchEnvironmentsForUser(user.preferred_username ?? '');

                setAuthSuccess(true);
            },
            (err: any) => {
                setAuthSuccess(false);
                throw err;
            },
        );
    }, [oktaAuth]);

    return (
        <Wrapper>
            <ErrorBoundary>
                <Loading loading={loading} />
                <Header/>

                <LoginForm onSubmit={submitFormLogin}>
                    {authorizedUserName &&
                        <AuthMessage>
                            <AuthIcon icon={faCheckCircle}/> Authorized as {authorizedUserName}
                        </AuthMessage>
                    }
                    <LoginCard auth={!authSuccess}>
                        {!authSuccess ?
                            <LoginWidget id={ID_OKTA_WIDGET}/>
                            :
                            <EnvSelector>
                                <SelectEnvironment
                                    value={environment}
                                    label='Environment'
                                    options={environments.map((e) => ({label: e.name, value: e.value}))}
                                    onChange={setEnvironment}
                                />

                                <SignInButton
                                    type="submit"
                                    buttonType='primary'
                                    disabled={!validForm}
                                >
                                    Enter
                                </SignInButton>
                            </EnvSelector>
                        }
                    </LoginCard>
                </LoginForm>

                <Footer/>
            </ErrorBoundary>
        </Wrapper>
    );
};

export default SSOLogin;
