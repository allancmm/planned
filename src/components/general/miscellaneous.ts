import styled from "styled-components";
import {Card} from "@equisoft/design-elements-react";
import {X} from "react-feather";

export const ContainerCenterRight = styled.div`
   display: flex;
   height: 100%;
   justify-content: end;
   align-items: center;
`;

export const ButtonSection = styled.div`
    padding: var(--s-half) 0;
    display: flex;  
    flex-wrap: wrap;    
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;        
    }
   justify-content: flex-end;
   > button {
     margin-left: 10px;
   } 
`;

export const TextEllipsis = styled.span`
      display: inline-block;
      text-overflow: ellipsis;
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
`;

export const CustomCard = styled(Card)<{ height: number }>`
   height: ${({ height }) => height ? `${height}px` : 'unset' };
   padding: var(--spacing-2x);
   margin-bottom: var(--spacing-2x);
   background: ${({ theme }) => theme.colors.background.main };
`;

export const TabContainer = styled.div`
   height: 100%;
   padding: var(--spacing-1x);
`;

export const CloseIcon = styled(X)`
    height: 12px;
    width: 12px;
`;

export const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    z-index: 1;
    position: relative;
    background-color: ${({ theme }) => theme.colors.background.main};
    color: ${(props) => props.theme.colors.text.primary};
`;

export const SelectEnvContainer = styled.div`
     display: contents;
     select {
        height: 34px;
        width: 100%;
        line-height: 27px;
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.greys['dark-grey']};
        padding: 0 var(--spacing-1x);
        font-size: 0.875rem;
        margin-bottom: var(--spacing-3x);
        position: relative;
        color: ${({ theme }) => theme.colors.text.primary};
        background-color: ${({ theme }) => theme.colors.background.panel};        
        :focus {
           outline: none;
           border-color: ${({ theme }) => theme.tokens['focus-border'] };
           border-width: 1px;          
           box-shadow: ${({ theme }) => theme.tokens['focus-box-shadow']}; 
        }
        :disabled {
           color: ${({ theme }) => theme.greys['mid-grey']} !important;
           background-color: ${({ theme }) => theme.greys['light-grey']} !important;
           border-color:${({ theme }) => theme.greys.grey} !important;
        }
        option {
          font-size: 0.875rem;
          color: ${({ theme }) => theme.colors.text.primary};
          background-color: ${({ theme }) => theme.colors.background.panel};
        }
    }
`;

export const ContainerFlex = styled.div`
   display: flex;
`;