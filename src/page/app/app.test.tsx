import { render, waitFor } from '@testing-library/react';
import { DesignThemeProvider } from 'equisoft-design-ui-elements';
import React from 'react';
import * as Context from '../../lib/context';
import App from './app';

describe('<App/>', () => {
    test('renders without crashing ', async () => {
        Context.defaultAuthService.loginEnvironments = jest.fn(() => Promise.resolve([]));

        const { getByTestId } = render(
            <DesignThemeProvider>
                <App />
            </DesignThemeProvider>,
        );

        await waitFor(() => {});

        expect(getByTestId('logo')).toBeInTheDocument();
    });
});
