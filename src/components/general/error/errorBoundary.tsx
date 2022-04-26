import { Button } from 'equisoft-design-ui-elements';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { AuthContext, AuthContextProps } from '../../../page/authContext';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: any;
    errorInfo?: any;
}

interface ErrorBoundaryProps {
    canLogout?: boolean;
}

const StackTraceWrapper = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
`;

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: any, errorInfo: any): void {
        this.setState({
            error,
            errorInfo,
        });
    }

    render(): ReactNode {
        const context: AuthContextProps = this.context;
        if (this.state.errorInfo) {
            // Error path
            return (
                <StackTraceWrapper>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                    {this.props.canLogout && (
                        <Button buttonType="primary" type="button" label="Logout" onClick={context.logout} />
                    )}
                </StackTraceWrapper>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
ErrorBoundary.contextType = AuthContext;
