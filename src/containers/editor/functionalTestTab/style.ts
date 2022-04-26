import styled from 'styled-components';

export const FunctionSidePanel = styled.div`
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.colors.text.primary};
    border: 1px solid #F1F2F2;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;    
`;

export const StepFieldContainer = styled.div`
  padding-right: 50px;
  
  .custom-label {
      display: inline-block;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
  }
`

const StatusBadge = styled.div`
    display: block;
    flex: 0 0 10px;
    border-radius: 50%;
    height: 10px;
    width: 10px;
`;

export const SuccessBadge = styled(StatusBadge)`
    background-color: #0bbf54;
`;

export const FailBadge = styled(StatusBadge)`
    background-color: #f1300a;
`;

export const SkipBadge = styled(StatusBadge)`
    background-color: orange;
`;

