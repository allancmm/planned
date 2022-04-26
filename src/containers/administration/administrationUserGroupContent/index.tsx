import React, { useContext, useEffect,  useState } from "react";
import produce, { Draft } from 'immer';
import { toast } from "react-toastify";
import { Loading, useLoading, WindowContainer } from "equisoft-design-ui-elements";
import { useTabWithId } from "../../../components/editor/tabs/tabContext";
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import { defaultUserService } from "../../../lib/context";
import UserService from "../../../lib/services/userService";
import AdministrationUserGroupSession from "../../../lib/domain/entities/tabData/administrationUserGroupSession";
import { AdmContent,  AdmLabel,  ButtonSection, GroupButtons } from "./style";
import ModalUserGroup from "../modal/userGroup";

import { useModal, Button } from '@equisoft/design-elements-react'
import ModalDialog from "../../../components/general/modalDialog";
import { Grid } from '@material-ui/core';
import {SecurityRole} from "../../../lib/domain/entities/securityRole";

interface UserGroupContentProps {
    tabId: string;
    userService: UserService
}

const UserGroupContent = ({ tabId, userService  } : UserGroupContentProps) => {

    const tab = useTabWithId(tabId);

    const { data } = tab;

    if (!(data instanceof AdministrationUserGroupSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const [loading, load ] = useLoading();

    const {  toggleRefreshSidebar } = useContext(SidebarContext);

    const {
        isModalOpen : isModalPrivilegesOpen,
        closeModal: closeModalPrivileges,
        openModal : openModalPrivileges,
    } = useModal();

    const {
        isModalOpen : isModalDeleteOpen,
        closeModal : closeModalDelete,
        openModal : openModalDelete,
    } = useModal();

    const { userGroup } = data;

    const [userGroupSession, setUserGroupSession] = useState(userGroup);

    const updateUserGroup = (recipe: (draft: Draft<SecurityRole>) => void) => {
        setUserGroupSession(produce(userGroupSession, recipe));
    };

    const [ users, setUsers ] = useState<string[]>([]);

    const [isRoleDeleted, setIsRoleDeleted] = useState(false);

    const fetchUsers = load(async () => userService.getSecurityRoleUsers(userGroupSession.securityRoleName));

    useEffect(() => {
        fetchUsers().then((res) => {
            setUsers(res);
        });
    }, []);

    const onConfirmDeleteRole = async () => {
        await userService.deleteSecurityRole(userGroupSession.securityRoleName);
        closeModalDelete();
        toggleRefreshSidebar();
        setIsRoleDeleted(true);
        toast.success('Role deleted successfully');
    }

    const onConfirmEditPrivileges = (newUserGroup: SecurityRole) => {
        updateUserGroup((draft) => {
            draft.securityRoleName = newUserGroup.securityRoleName;
            draft.privileges =  newUserGroup.privileges;
        });
       toggleRefreshSidebar();
    };

    return (
        <WindowContainer>
            <Loading loading={loading} />

            <AdmContent>
                {!isRoleDeleted ?
                    <Grid container>
                        <Grid item xs={2}>
                            <AdmLabel >Role </AdmLabel>
                            <ul>
                                <li>
                                    <span>{userGroupSession.securityRoleName}</span>
                                </li>
                            </ul>
                        </Grid>
                        <Grid item xs={6} >
                            <AdmLabel>Privileges </AdmLabel>
                            <ul>
                                {userGroupSession.privileges.map(({privilegeName}) => (
                                    <li key={privilegeName}> {privilegeName}</li>
                                ))}
                            </ul>
                        </Grid>
                        <Grid item xs={4}>
                            <AdmLabel>Users </AdmLabel>
                            <ul>
                                {users.map((user) => (
                                    <li key={user}>{user}</li>
                                ))}
                            </ul>
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonSection>
                                <GroupButtons>
                                    <Button
                                        disabled={loading || users.length > 0}
                                        buttonType="destructive"
                                        onClick={openModalDelete}
                                        label="Delete"
                                    />

                                    <Button
                                        buttonType="primary"
                                        onClick={ openModalPrivileges }
                                        label="Edit"
                                    />
                                </GroupButtons>
                            </ButtonSection>
                        </Grid>
                    </Grid>
                    :
                    <span>No records to display.</span>
                }
            </AdmContent>

             <ModalDialog isOpen={isModalDeleteOpen}
                          onRequestClose={closeModalDelete}
                          title="Are you sure you want to delete this security role?"
                          confirmButton={{ onConfirm: onConfirmDeleteRole }}
             />


            {isModalPrivilegesOpen && <ModalUserGroup
                                          typeMode="Edit"
                                          userGroup={userGroupSession}
                                          closeModal={closeModalPrivileges}
                                          onConfirm={onConfirmEditPrivileges}
                                      />
            }
        </WindowContainer>
    );
}

UserGroupContent.defaultProps = {
    userService: defaultUserService
};

export default UserGroupContent;