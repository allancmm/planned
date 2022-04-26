import { fireEvent, render, waitFor } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { anyString, instance, mock, reset, when } from 'ts-mockito';
import Header from '.';
import * as Context from '../../../lib/context';
import AuthData from '../../../lib/domain/entities/authData';
import Environment from '../../../lib/domain/entities/environment';
import UserSettings from '../../../lib/domain/entities/userSettings';
import AuthService from '../../../lib/services/authService';
import AuthProvider from '../../../page/authContext';

const mData = mock(AuthData);
const mUSettings = mock(UserSettings);
const mService = mock(AuthService);
const mEnv = mock(Environment);

// TODO - Allan - fix errors running this components with Userprofile from DS
const renderWithAuthData = async (ui: ReactElement, { service = instance(mService), ...options }: any = {}) => {
    const wrapper = (props: any) => <AuthProvider authService={service} {...props} />;

    const utils = render(ui, { wrapper, ...options });
    await waitFor(() => { }); // wait for the provider effect
    return utils;
};

describe('Top part of the app', () => {
    let service: AuthService;
    let data: AuthData;
    let uSettings: UserSettings;
    let env: Environment;
    beforeEach(() => {
        Context.defaultAuthService.loginEnvironments = jest.fn(() => Promise.resolve([]));
        service = instance(mService);
        data = instance(mData);
        env = instance(mEnv);
        uSettings = instance(mUSettings)
        when(mService.getAuthData()).thenResolve(data);
        when(mService.loginEnvironments(anyString())).thenResolve([]);
        when(mData.oipaEnvironment).thenReturn(env);
        when(mData.userName).thenReturn('test');
        when(mData.userSettings).thenReturn(uSettings)
    });

    afterEach(() => {
        reset(mService);
        reset(mData);
    });

    describe('<Header />', () => {
        test('should render without crashing', async () => {
            const { getByTestId } = await renderWithAuthData(<Header />);
            expect(getByTestId('logo')).toBeInTheDocument();
        });

        test('should fetch and render the username', async () => {
            const { getByText } = await renderWithAuthData(<Header />, { service });
            expect(getByText('test')).toBeInTheDocument();
        });

        test('should fetch and render the oipa environment', async () => {
            when(mEnv.displayName).thenReturn('env');

            const { getByText } = await renderWithAuthData(<Header />, { service });
            expect(getByText(/env/)).toBeInTheDocument();
        });
    });

    describe('<ProfileMenu />', () => {
        test('should toggle a dropdown with clicking on the name', async () => {
            const { getByText } = await renderWithAuthData(<Header />, { service });

            const toggle = getByText('test');
            expect(getByText('Logout')).not.toBeVisible();
            fireEvent.click(toggle);
            expect(getByText('Logout')).toBeVisible();
            fireEvent.click(toggle);
            expect(getByText('Logout')).not.toBeVisible();
        });

        test('dropdown has 3 options', async () => {
            const { getByText, getAllByText, getByTestId } = await renderWithAuthData(<Header />, { service });
            expect(getByTestId('menu-dd').childElementCount).toBe(4);
            expect(getByText('Logout')).toBeInTheDocument();
            getAllByText('Preferences').forEach((text) => expect(text).toBeInTheDocument());
        });

        test('expect toggling theme ', async () => {
            const { getByText, getByTestId } = await renderWithAuthData(<Header />, { service });

            const toggle = getByText('test');
            fireEvent.click(toggle);
            expect(getByText('Toggle Theme')).toBeVisible();

            fireEvent.click(getByText('Toggle Theme'));
            expect(getByText('Toggle Theme')).toBeVisible();
            await waitFor(() => { });
            expect(getByTestId('menu-dd').parentElement).toHaveStyleRule('background-color', '#01151f');

            fireEvent.click(getByText('Toggle Theme'));
            expect(getByText('Toggle Theme')).toBeVisible();
            await waitFor(() => { });
            expect(getByTestId('menu-dd').parentElement).toHaveStyleRule('background-color', '#ffffff');
        });
    });
});
