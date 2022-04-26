import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export const TestSuiteContainer = styled.div`
   padding: 16px;
   
    > div + div {
       margin-top: 16px;
    }
`;

export const TestSuiteIcon = styled(FontAwesomeIcon)`
    margin-right: 4px;
    font-size: 16px;
    vertical-align: 0;
`;

export const TestSuiteList = styled.ul`
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    padding-left: 0;

    li + li {
       margin-top: 6px;
    }
    li {
        display: flex;
        justify-content: space-between;

        div {
            display: flex;
            align-items: center;

            * + * {
                margin-left: 4px;
            }
        }
        
        .open-test-suite {
            cursor: pointer;
        }
    }
`;
