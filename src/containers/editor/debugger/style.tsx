import React from "react";
import { Button } from '@equisoft/design-elements-react';
import styled from 'styled-components';

export const DebugFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 16px 16px 16px;
    height: 100%;

    & > div {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        max-width: 100%;
    }
    
    & label {
      margin-top: 16px;
    }
    
    .sc-bqGGPW + .sc-bqGGPW, .gWCLuf + button {
       margin-top: unset;
    }
`;

const ButtonContainer = styled.div`
   margin: auto auto 0 auto;
   width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`

export const NewDebugButton = (props: any) =>
    <ButtonContainer>
        <ButtonWrapper>
            <Button {...props}/>
        </ButtonWrapper>
    </ButtonContainer>;


export const EntityLevelContainer = styled.div`
    display: flex;
    flex-direction: column;
    
    > button {
       margin: 16px 0 0;
    }
`;

export const OpenInterpreterContainer = styled.div`
  padding: 6px 12px 16px;
`;

export const ParametersContainer = styled.div`
   max-width: 1000px;
`;