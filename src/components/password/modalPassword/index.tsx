import React, {  useContext, useState } from "react";
import produce, { Draft } from "immer";
import { Loading, useLoading } from "equisoft-design-ui-elements";
import ModalDialog from "../../general/modalDialog";
import { UserPasswordEditionRequest as UserPassword } from "../../../lib/infra/request/userPasswordEditionRequest";
import UserService from "../../../lib/services/userService";
import { defaultUserService } from "../../../lib/context";
import { AuthContext } from "../../../page/authContext";
import { ErrorValidation, buildMessages } from "../../../lib/domain/entities/errorValidation";
import FormPassword from "../formPassword";
import { toast } from "react-toastify";

interface ModalChangePasswordProps {
    onConfirm?: Function,
    closeModal: Function,
    userService: UserService
}

const ModalChangePassword = ({ onConfirm, closeModal, userService } : ModalChangePasswordProps) => {

    const { auth } = useContext(AuthContext);

    const [loading, load] = useLoading();

    const [userPassword, setUserPassword] = useState<UserPassword>(new UserPassword());

    const [errorValidation, setErrorValidation] =
        useState<ErrorValidation>( new ErrorValidation(false, buildMessages(userPassword)));

    const updateUser = (recipe: (draft: Draft<UserPassword>) => void) => {
        setUserPassword(produce(userPassword, recipe));
    };

    const onChange = (field: keyof UserPassword, value: string) => {
        updateUser((draft) => {
            (draft[field] as string) = value;
        });
    };

    const updatePassword = load( async () => userService.updateUserPassword(auth.userName, userPassword));

    const handleClickConfirm = async () => {
        const error = userService.validatePasswordSameUser(userPassword);
        setErrorValidation(error)
        if(error.hasError){
            return;
        }
        await updatePassword();
        onConfirm && onConfirm();
        toast.success('Password updated successfully');
        closeModal();
    }

    return(
        <ModalDialog
            appElement="#root"
            isOpen
            confirmButton={{
                onConfirm: handleClickConfirm
            }}
            onRequestClose={closeModal}
            title="Change Password"
        >
            <>
                <Loading loading={loading} />

                <FormPassword userPassword={userPassword} onChange={onChange} errorValidation={errorValidation} />
            </>
        </ModalDialog>
    );
}

ModalChangePassword.defaultProps = {
    userService: defaultUserService
}

export default  ModalChangePassword;