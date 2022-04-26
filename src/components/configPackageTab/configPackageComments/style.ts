import { Send } from 'react-feather';
import styled from 'styled-components';

// TODO - Allan - classNames bellow were inside of a css file. Adjustments must be done
export const CommentContainer = styled.div`
  padding: var(--spacing-2x);
  
  .commentBadge {
        border: 1px solid #ccc;
        border-radius: 3px;
        display: inline-block;
        font-weight: bold;
        line-height: 99%;
        margin: 0;
        padding: 2px 5px;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
    }
    
    .badgeAccepted {
        background-color: #14892c;
        border-color: #14892c;
        color: #fff;
    }
    
    .badgeRefused {
        background-color: #b95a00;
        border-color: #b95a00;
        color: #fff;
    }
    
    .badgeMigrated {
        background-color: #14892c;
        border-color: #14892c;
        color: #fff;
    }
    
    .badgeUpdated {
        background-color: #f6c342;
        border-color: #f6c342;
        color: #000000;
    }
    
    .badgeCreated {
        background-color: #006296;
        border-color: #006296;
        color: #fff;
    }
`;

export const Comment = styled.div`
    border-bottom: 1px solid grey;
    padding: 5px;
`;

export const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: small;
    font-weight: 300;
`;

export const CommentReviewer = styled.div``;

export const CommentDate = styled.div``;

export const CommentContent = styled.div``;

export const CommentEdit = styled.form`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-2x);
    > div {
       flex: 1;
    }
    .configPkg-commentEdit__input {
        flex: auto;
        margin-bottom: 0;
    }
`;

export const SendComment = styled(Send)`
    width: 24px;
    height: 24px;
    cursor: pointer;
    border-radius: 50%;
    padding: 5px;
    margin-left: var(--spacing-half);

    background-color: ${({ theme }) => theme.colors.buttons.primary[0]};
    color: ${({ theme }) => theme.colors.text.secondary};

    &:focus,
    &:hover {
        background-color: ${({ theme }) => theme.colors.buttons.primary[1]};
    }
`;
