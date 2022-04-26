import styled, { css } from "styled-components";
import { DefaultBadge } from "../../../../components/general/sidebar/entitySummary/style";

export const BasicActionBadge = styled(DefaultBadge)`
    background-color: #1560bd;
    color: white;
    &:before {
       content: ' ? '
    }
`;

const CustomCssStep = css`
    font-size: 12px;
    font-weight: 400;
    width: 24px;
`;

export const MathActionBadge = styled(DefaultBadge)`
    ${CustomCssStep};
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'ma'
    }
`;

export const AssessmentFileBadge = styled(DefaultBadge)`
    ${CustomCssStep};
    background-color: #f1300a;
    color: white;
    &:before {
       content: 'afc'
    }
`;

export const AssessmentSqlBadge = styled(DefaultBadge)`
    ${CustomCssStep};
    background-color: #0bbf54;
    color: white;
    &:before {
       content: 'sql'
    }
`;

export const ActionSoapBadge = styled(DefaultBadge)`
    ${CustomCssStep};
    background-color: #006296;
    color: white;
    &:before {
       content: 'soa'
    }
`;

