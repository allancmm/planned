import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import produce, { Draft } from 'immer';
import ModalDialog from "../../../../components/general/modalDialog";
import { Loading, useLoading} from "equisoft-design-ui-elements";
import { defaultUserService } from "../../../../lib/context";
import UserService from "../../../../lib/services/userService";
import Pageable from "../../../../lib/domain/util/pageable";
import { SecurityRole } from "../../../../lib/domain/entities/securityRole";
import { User } from "../../../../lib/domain/entities/user";
import { toast } from "react-toastify";

import InputText, { Options } from "../../../../components/general/inputText";
import { MSG_REQUIRED_FIELD, MSG_DIFFERENT_PASSWORDS } from "../../../../lib/constants";
import {hasExternalLoginIntegration} from '../../../../page/authContext';
import { SelectInput } from "./style";

const errorInitial: any = {
    hasError: false,
    messages: {}
};

interface ModalUserProps {
    onConfirm: Function,
    closeModal: Function,
    userService?: UserService
}

const ModalUser = ({ onConfirm,  closeModal, userService } : ModalUserProps) => {

    const [user, setUser] = useState<User>(new User());

    const [errorValidation, setErrorValidation] = useState(errorInitial);

    const updateUser = (recipe: (draft: Draft<User>) => void) => {
        setUser(produce(user, recipe));
    };

    const [loading, load] = useLoading();

    const [pageUserGroup] = useState(Pageable.withPageOfSize());

    const [userGroups, setUserGroups ] = useState<SecurityRole[]>([]);

    const fetchUserGroups = load(async (newPage: Pageable)  => userService?.getSecurityRolePage(newPage));

    const createUser = load(async () => userService?.createUser(user));

    const getAllGroups = (pageParam: Pageable) => {
        fetchUserGroups(pageParam).then((res) => {
            const { securityRoles, page }  = res;
            setUserGroups((s) => ([...s, ...securityRoles]));
            !page.isLast() && getAllGroups(page.nextPage());
        });
    };

    useEffect(() => {
        getAllGroups(pageUserGroup);
    }, []);

    const optionsRole = useMemo(() => userGroups.map(({securityRoleName}) =>
        new Options(securityRoleName, securityRoleName)), [userGroups]);

    const editPassword = !hasExternalLoginIntegration();

    const validation = () =>
        Object.keys(user).reduce((error: any, key) => {
            let msg;
            switch (key) {
                case 'userName': {
                    msg = !user[key] && MSG_REQUIRED_FIELD;
                    break;
                }
                case 'password': {
                    msg = editPassword && !user[key] && MSG_REQUIRED_FIELD;
                    break;
                }
                case 'password2': {
                    msg = editPassword && (user.password2 ?
                        user.password !== user.password2 ?
                            MSG_DIFFERENT_PASSWORDS : null : MSG_REQUIRED_FIELD);
                    break;
                }
                case 'securityRole': {
                    msg = !user.securityRole.securityRoleName && MSG_REQUIRED_FIELD;
                    break;
                }
                default: return error;
            }
            return {...error, hasError: error.hasError || !!msg, messages: {...error.messages, [key]: msg}};
        }, {});

    const handleClickConfirm = async () => {
        const error = validation();
        setErrorValidation(error)
        if(error.hasError){
            return;
        }
        await createUser();
        toast.success("User created successfully");
        closeModal();
        onConfirm();
    };

    const onChange = (field: string, value: string | SecurityRole) => {
        updateUser((draft) => {
            (draft as any)[field] = value;
        });
    };

    return (
        <ModalDialog isOpen
                     onRequestClose={closeModal}
                     confirmButton={{
                         onConfirm: handleClickConfirm
                     }}
                     title="Create new user">
            <>
                <Loading loading={loading} />

                <InputText label='Client number'
                           type="text"
                           value={user.userName}
                           feedbackMsg={errorValidation.messages.userName}
                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
                               onChange( 'userName', e.currentTarget.value)}
                />

                { editPassword && <InputText type="password"
                           label="Password"
                           value={user.password}
                           feedbackMsg={errorValidation.messages.password}
                           onChange={(e: ChangeEvent<HTMLInputElement> ) =>
                               onChange( 'password', e.currentTarget.value)
                           }/>
                }

                { editPassword && <InputText type="password"
                           label="Confirm password"
                           value={user.password2}
                           feedbackMsg={errorValidation.messages.password2}
                           onChange={(e: ChangeEvent<HTMLInputElement> ) =>
                               onChange( 'password2', e.currentTarget.value)
                           }/>
               }

                <SelectInput>
                    <InputText type="select"
                               label="Security role"
                               value={user.securityRole.securityRoleName}
                               feedbackMsg={errorValidation.messages.securityRole}
                               options={optionsRole}
                               onChange={(option: { value: string; } ) =>
                                   onChange( 'securityRole', new SecurityRole(option.value))
                               }/>
                </SelectInput>
            </>
        </ModalDialog>);
}

ModalUser.defaultProps = {
    userService: defaultUserService
};

export default ModalUser;