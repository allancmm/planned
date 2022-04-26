import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Button } from "@equisoft/design-elements-react";

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    & > * {
        width: 100%;
    }
`;

export const Header = styled.div`
    display: flex;
    flex: 1 1 15vh;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    margin-top: 10vh;
    
    & > img {
        width: 25rem;
    }
`;

export const ErrorMessage = styled.p`
    color: red;
    text-align: center;
    max-height: 64px;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const LoginForm = styled.form`
    display: flex;
    flex: 2 1 40vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    
    .MuiOutlinedInput-input {
        padding: 8.5px 14px;
    }
    
    .MuiInputBase-input {
       font-size: 0.875rem;
       font-family: "Open Sans",sans-serif;
       letter-spacing: 0.015rem;
    }
    
   .MuiOutlinedInput-root {
       &.Mui-focused fieldset {
        outline: none;
        border-color: ${({ theme }) => theme.tokens['focus-border'] };
        border-width: 1px;          
        box-shadow: ${({ theme }) => theme.tokens['focus-box-shadow']};     
       }
    }
    
    .MuiOutlinedInput-notchedOutline {
       border-color: ${({ theme }) => theme.greys['dark-grey']};
    }
`;

export const SignInButton = styled(Button)`
    height: 32px;
    line-height: 1rem;
    vertical-align: middle;
    text-align: center;
    padding: 0px;

    font-size: 15px;
    font-weight: 550;
    cursor: pointer;
`;

export const Footer = styled.div`
    display: flex;
    flex: 1 1 15vh;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10vh;
`;

export const Build = styled.div`
    font-weight: 550;
`;

export const Legal = styled.div`
    color: grey;
`;

export const LoginCard = styled.div<{ auth: boolean }>`
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 343px;
    flex-grow: 1;

    #okta-sign-in {
        margin-top: 0;
        margin-bottom: 0;

        .auth-header {
            padding-top: 0;
        }
    }
`;

export const AuthMessage = styled.div`
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
`;

export const AuthIcon = styled(FontAwesomeIcon)`
    margin-right: 8px;
    color: green;
`;

export const EnvSelector = styled.div`
    display: contents;
    
    select {
        height: 32px;
        line-height: 27px;
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.greys['dark-grey']};
        padding: 0px 7px;
        font-size: 12px;
        margin-bottom: 20px;
        position: relative;
        background-color: transparent;
        :focus {
           outline: none;
           border-color: ${({ theme }) => theme.tokens['focus-border'] };
           border-width: 1px;          
           box-shadow: ${({ theme }) => theme.tokens['focus-box-shadow']}; 
        }
        option {
          font-size: 0.875rem;
        }
    }
`;

export const LoginWidget = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const LoginFieldsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    
    .form-content {
       margin: 0 0 var(--spacing-3x);
    }
`;

export const MessageAdminExistContainer = styled.div`
    display: inline-block;
    width: auto;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    
    & > a {
      margin: 0 5px;
    }
`;
