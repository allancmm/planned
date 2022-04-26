import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import produce, { Draft } from 'immer';
import { toast } from "react-toastify";
import { Banner } from '@equisoft/design-elements-react';
import ModalDialog from "../../../../components/general/modalDialog";
import InputText from "../../../../components/general/inputText";
import { SecurityRole} from "../../../../lib/domain/entities/securityRole";
import isEqual from "lodash.isequal";

import TransferList from "../../../../components/general/transferList";

import Privilege from "../../../../lib/domain/entities/privilege";
import { Loading, useLoading } from "equisoft-design-ui-elements";
import { defaultUserService } from "../../../../lib/context";
import UserService from "../../../../lib/services/userService";
import { MSG_REQUIRED_FIELD } from "../../../../lib/constants";

const errorInitial: any = {
    messages: {
        securityRoleName: null
    }
};

export type TypeMode = 'Add' | 'Edit' | 'Unknown';

interface ModalUserGroupProps {
    typeMode: TypeMode,
    userGroup?: SecurityRole,
    closeModal: Function,
    onConfirm: Function,
    userService?: UserService
}

const ModalUserGroup = ({ typeMode, userGroup,  closeModal, onConfirm, userService }
                                  : ModalUserGroupProps) => {
    const [userGroupSession, setUserGroupSession] = useState(userGroup || new SecurityRole());

    const [errorValidation, setErrorValidation] = useState(errorInitial);

    const updateUserGroup = (recipe: (draft: Draft<SecurityRole>) => void) => {
        setUserGroupSession(produce(userGroupSession, recipe));
    };

    const [loading, load] = useLoading();

    const createUserGroup = load(async (userGroupParam) => userService?.createSecurityRole(userGroupParam));

    const fetchAllPrivileges = load(async ()  =>  userService?.getPrivilegeList());

    const editUserGroup = load(
         async (userGroupParam : SecurityRole) =>
             userService?.editSecurityRole(userGroup?.securityRoleName || "", userGroupParam));

    const [privilegesGroup, setPrivilegesGroup] =  useState<string[]>([]);

    const [privilegesGroupSet, setPrivilegesGroupSet] = useState(new Set());

    const [allPrivileges, setAllPrivileges ] = useState<string[]>([]);

    const privilegesChoices = useMemo(() => allPrivileges.filter((pvl) =>
         !privilegesGroupSet.has(pvl)), [allPrivileges, privilegesGroupSet]);

    const [newListChosen, setNewListChosen] = useState<string[]>([]);

    const [isShowBanner, setIsShowBanner] = useState(false);

    const [messageBanner, setMessageBanner] = useState("");

    useEffect(() => {
        const privileges = userGroup?.privileges.map(({ privilegeName }) =>
            privilegeName) || [];
        setPrivilegesGroupSet(new Set(privileges));
        setPrivilegesGroup(privileges);
    }, [userGroup?.privileges]);

     useEffect(() => {
         fetchAllPrivileges().then((res) => {
             const { privileges }  = res;
             setAllPrivileges(privileges.map(({ privilegeName } : Privilege) => privilegeName));
         });
     }, []);

    const onChangePrivileges = (newListChosenParam: string[]) => {
        setNewListChosen(newListChosenParam);
        setIsShowBanner(false);
        updateUserGroup((draft) => {
            draft.privileges =  newListChosenParam.map((privilegeName) => {
                    const privilege : Privilege = new Privilege();
                    privilege.privilegeName = privilegeName;
                    return privilege;
                }
            );
        });
    }

    const onChangeRoleName = (newRoleName: string) => {
        setIsShowBanner(false);
        updateUserGroup((draft) => {
            draft.securityRoleName = newRoleName;
        });
    }

    const validation = () => {
        if(!userGroupSession.securityRoleName) {
            setErrorValidation({ messages: { securityRoleName: MSG_REQUIRED_FIELD }});
            return false;
        }

        if(typeMode === 'Edit' && ((userGroupSession.securityRoleName === userGroup?.securityRoleName) &&
            isEqual(privilegesGroup, newListChosen))) {
            setMessageBanner('ERROR! Nothing has changed');
            setIsShowBanner(true);
            return false ;
        }
        return true;
    }

    const handleClickConfirm = async () => {
        if(validation()){
             if(typeMode === 'Add'){
                 await createUserGroup(userGroupSession);
                 toast.success("User group created successfully");
             } else {
                 await editUserGroup(userGroupSession);
                 toast.success('Privileges saved successfully')
             }
             closeModal();
             onConfirm(userGroupSession);
        }
    }

    return (
        <ModalDialog isOpen
                     onRequestClose={closeModal}
                     confirmButton={{
                         onConfirm: handleClickConfirm
                     }}
                     title="User group">
            <>
                <Loading loading={loading} />

                {isShowBanner && <Banner type="error"> {messageBanner}</Banner>}

                <InputText
                    value={userGroupSession.securityRoleName}
                    label="Role Name"
                    type="text"
                    feedbackMsg={errorValidation.messages.securityRoleName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChangeRoleName(e.target.value);
                    }}
                  />

                <TransferList label="Privileges"
                              listChoices={privilegesChoices}
                              listChosen={privilegesGroup}
                              titleChoices="Available Privileges"
                              titleChosen="Selected Privileges"
                              onChange={onChangePrivileges} />
            </>
        </ModalDialog>
    );
}

ModalUserGroup.defaultProps = {
    typeMode: '',
    userGroup: new SecurityRole(),
    onConfirm: () => null,
    userService: defaultUserService
};

export default ModalUserGroup;
