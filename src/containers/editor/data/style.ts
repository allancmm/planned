import styled from 'styled-components';

export const DataFieldsContainer = styled.div`
    padding: 16px;    
    span > div > div:first-of-type {
       margin-top: 5px;
    }
`

export const ButtonDiv = styled.div`
    width: 100%;
    
    > button {
        float: right;
    }
`;

export const TextAreaContent = styled.span`
  textarea {
      flex: none;
      max-height: inherit;
   }
`;

export const MoneyTypeContainer = styled.div`
    max-height: 140px;
    margin: 16px 0 16px;    
    border: 1px solid rgb(217,221,226);
    & > div {
        max-height: 140px;
        overflow: auto;
    }
`;

export const MoneyTypeListCustom = styled.div`    
   .list-container {
      > div {
         margin: 1px 0;
      }
      
      span {
         margin: 0 16px;
      }
   }
   
   .pagination-custom {
     padding: 12px 16px 0;
   }
`
