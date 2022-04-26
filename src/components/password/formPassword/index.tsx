import React, { ChangeEvent } from "react";
import InputText from "../../general/inputText";
import { UserPasswordEditionRequest as UserPassword} from "../../../lib/infra/request/userPasswordEditionRequest";
import { ErrorValidation } from "../../../lib/domain/entities/errorValidation";

interface FormPasswordProps {
    userPassword: UserPassword,
    onChange: Function,
    errorValidation: ErrorValidation
}

const FormPassword = ({ userPassword, onChange, errorValidation } : FormPasswordProps) => {

    return (
        <>
            <InputText label='Current password'
                       type="password"
                       value={userPassword.currentPassword}
                       feedbackMsg={errorValidation.messages.currentPassword}
                       onChange={(e: ChangeEvent<HTMLInputElement>) =>
                           onChange( 'currentPassword', e.currentTarget.value)}
                       required
            />

            <InputText label='New password (must be 8 characters min)'
                       type="password"
                       value={userPassword.newPassword}
                       feedbackMsg={errorValidation.messages.newPassword}
                       onChange={(e: ChangeEvent<HTMLInputElement>) =>
                           onChange( 'newPassword', e.currentTarget.value)}
                       required
            />

            <InputText label='Confirm password'
                       type="password"
                       value={userPassword.confirmPassword}
                       feedbackMsg={errorValidation.messages.confirmPassword}
                       onChange={(e: ChangeEvent<HTMLInputElement>) =>
                           onChange( 'confirmPassword', e.currentTarget.value)}
                       required
            />
        </>
    );
}

FormPassword.defaultProps = {}

export default FormPassword;