import React from "react";
import { Wrapper } from "../login/style";
import { Header, Footer } from "../components";
import { MessageContainer } from "./style";
import { Link } from "react-router-dom";
import { RouteLink } from "@equisoft/design-elements-react";
import ErrorBoundary from '../../components/general/error/errorBoundary';

const PageNotFound = () => {
    return (
        <Wrapper>
            <ErrorBoundary>
                <Header title='404 PAGE NOT FOUND' />
                <MessageContainer>
                    <RouteLink routerLink={Link} href="/editor" label="Click here" />
                    <span>&nbsp;to go main page</span>
                </MessageContainer>
            </ErrorBoundary>
            <Footer />
        </Wrapper>
    );
}

export default PageNotFound;