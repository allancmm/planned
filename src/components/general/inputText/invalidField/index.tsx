import React, { ReactElement } from 'react';
import { Icon } from '@equisoft/design-elements-react';
import { Field, StyledIcon, StyledSpan } from "./style";

interface InvalidFieldProps {
    feedbackMsg: string;
    controlId?: string;
}

const InvalidField = ({ controlId = '', feedbackMsg }: InvalidFieldProps): ReactElement => {
    return (
        <Field
            aria-live="polite"
            id={`${controlId}_invalid`}
            role="alert"
        >
            <StyledIcon>
                <Icon name="alertTriangle" size='16' />
            </StyledIcon>
            <StyledSpan>{feedbackMsg}</StyledSpan>
        </Field>
    );
}

export default InvalidField ;