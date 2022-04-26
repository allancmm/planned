import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import produce, { Draft } from "immer";
import { toast } from "react-toastify";
import { Loading, useLoading, WindowContainer } from "equisoft-design-ui-elements";
import { useModal, Button, IconButton } from '@equisoft/design-elements-react'
import ModalDialog from "../../../components/general/modalDialog";
import { useTabActions, useTabWithId } from "../../../components/editor/tabs/tabContext";
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import { CLOSE } from "../../../components/editor/tabs/tabReducerTypes";
import { defaultUserService } from "../../../lib/context";
import UserService from "../../../lib/services/userService";
import AdministrationUserSession from "../../../lib/domain/entities/tabData/administrationUserSession";
import { SecurityRole } from "../../../lib/domain/entities/securityRole";
import Pageable from "../../../lib/domain/util/pageable";
import InputText, { Options } from "../../../components/general/inputText";
import { AdministrationContainer, ButtonSection } from "../styles";
import { User } from "../../../lib/domain/entities/user";
import { UserPasswordEditionRequest as UserPassword } from "../../../lib/infra/request/userPasswordEditionRequest";
import {AuthContext, hasExternalLoginIntegration} from '../../../page/authContext';
import { FormPassword } from "../../../components/password";
import { RowContentUser } from "./styles";
import { buildMessages, ErrorValidation } from "../../../lib/domain/entities/errorValidation";

type TypeAllowedUser = string | SecurityRole;

interface UserContentProps {
    tabId: string;
    layoutId: number;
    userService: UserService
}

const UserContent = ({ tabId, layoutId, userService  } : UserContentProps) => {

    const tab = useTabWithId(tabId);

    const { data } = tab;

    if (!(data instanceof AdministrationUserSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { auth } = useContext(AuthContext);

    const [loading, load] = useLoading();

    const dispatch = useTabActions();

    const closeTab = () => dispatch({ type: CLOSE, payload: { id: tabId, layoutId } });

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const { toggleRefreshSidebar } = useContext(SidebarContext);

    const { user } = data;

    const [ isEditRole, setIsEditRole ] = useState(false );

    const [ isEditPassword, setIsEditPassword ] = useState(false );

    const [ userSession, setUserSession ] = useState(user);

    const [ userGroups, setUserGroups ] = useState<SecurityRole[]>([]);

    const [ pageUserGroup ] = useState(Pageable.withPageOfSize());

    const [userPassword, setUserPassword] = useState<UserPassword>(new UserPassword());

    const showFormPassword = useMemo(() => isEditPassword && auth.userName === user.userName, [isEditPassword, auth.userName, user.userName]);

    const fetchUserGroups = load(async (newPage: Pageable)  => userService.getSecurityRolePage(newPage));

    const hasRsAdminSecurityRole = user.securityRole.securityRoleName === 'RSAdmin';

    const getGroups = (pageParam: Pageable) => {
        fetchUserGroups(pageParam).then((res) => {
            const { securityRoles, page }  = res;
            setUserGroups((s) => ([...s, ...securityRoles]));
            !page.isLast() && getGroups(page.nextPage());
        });
    };

    useEffect(() => {
        if(hasRsAdminSecurityRole){
            setUserGroups([new SecurityRole('RSAdmin')]);
        } else {
            getGroups(pageUserGroup);
        }
    }, [hasRsAdminSecurityRole]);

    const optionsRole = useMemo(() => userGroups.map(({ securityRoleName}) =>
        new Options(securityRoleName, securityRoleName)), [userGroups]);

    const onChange = (field: keyof User, value: string | SecurityRole) => {
        setUserSession(produce(userSession, (draft) => {
            (draft[field] as TypeAllowedUser) = value;
        }));
    }

    const onClickSave = load( async() => {
        if(isEditRole){
            await userService.editUser(userSession.userName, userSession.securityRole.securityRoleName);
            toast.success('Role updated successfully');
            setIsEditRole(false);
            toggleRefreshSidebar();
        } else {
            if(showFormPassword){
                const error = userService.validatePasswordSameUser(userPassword);
                setErrorValidation(error)
                if(error.hasError){
                    return;
                }
                await userService.updateUserPassword(userSession.userName, userPassword);
                toast.success('Password updated successfully');
                setIsEditPassword(false);
                setUserPassword(new UserPassword());
            } else {
                if(user.password !== userSession.password) {
                    const error = userService.validatePasswordDifferentUser(userSession.password);
                    setErrorValidation(error);
                    if(error.hasError){
                        return;
                    }
                    userPassword.newPassword = userSession.password;
                    userPassword.confirmPassword = userSession.password;
                    await userService.updateUserPassword(userSession.userName, userPassword);
                    toast.success('Password updated successfully');
                    setIsEditPassword(false);
                }
            }

        }
    });

    const onClickDelete = load(async() => {
        await userService.deleteUser(userSession.userName);
        closeModal();
        toggleRefreshSidebar();
        toast.success('User deleted successfully');
        closeTab();
    });

    const onCancel = () => {
        setIsEditPassword(false);
        setIsEditRole(false);
        setUserSession(user);
    };

    const onClickEditPassword = () => {
        setIsEditPassword(true);
        setIsEditRole(false);
    }

    const onClickEditRole = () => {
        setIsEditRole(true);
        setIsEditPassword(false);        
    }

    const updateUser = (recipe: (draft: Draft<UserPassword>) => void) => {
        setUserPassword(produce(userPassword, recipe));
    };

    const [errorValidation, setErrorValidation] =
        useState<ErrorValidation>( new ErrorValidation(false, buildMessages(userPassword)));

    const onChangeFormPassword = (field: keyof UserPassword, value: string) => {
        updateUser((draft) => {
            (draft[field] as string) = value;
        });
    };

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <AdministrationContainer>
                <RowContentUser>
                    <div className='inputText'>
                        <InputText
                            label="User"
                            value={userSession.userName}
                            disabled
                            onChange={() => null}
                        />
                    </div>
                </RowContentUser>


                <RowContentUser>
                    <div className='inputText'>
                        <InputText label="Role"
                                   type="select"
                                   options={optionsRole || []}
                                   value={userSession.securityRole.securityRoleName}
                                   disabled={!isEditRole}
                                   onChange={({ value }: Options ) =>
                                       onChange( 'securityRole', new SecurityRole(value))
                                   } />
                    </div>
                    { !isEditRole &&
                      !hasRsAdminSecurityRole &&
                        <div className='buttonEdit'>
                            <IconButton buttonType="tertiary" iconName='edit' onClick={onClickEditRole} />
                        </div>}
                </RowContentUser>

                {showFormPassword ?
                    <RowContentUser>
                        <div className='inputText'>
                            <FormPassword userPassword={userPassword}
                                          onChange={onChangeFormPassword}
                                          errorValidation={errorValidation}/>
                        </div>
                    </RowContentUser>
                    :
                    <RowContentUser>
                        <div className='inputText'>
                            <InputText label='Password'
                                       type='password'
                                       placeholder={ !isEditPassword ? '••••••••' : ''}
                                       value={userSession.password}
                                       disabled={!isEditPassword}
                                       feedbackMsg={errorValidation.messages.password}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('password', e.target.value)}/>
                        </div>
                        {!isEditPassword && !hasExternalLoginIntegration() &&
                             <div className='buttonEdit'>
                                <IconButton buttonType="tertiary"
                                            iconName='edit'
                                            onClick={onClickEditPassword}
                                />
                            </div>}
                    </RowContentUser>
                }
                <ButtonSection>
                    { (isEditRole || isEditPassword) ?
                        <>
                            <Button
                                buttonType="secondary"
                                onClick={ onCancel }
                                label="Cancel"
                            />
                            <Button
                                buttonType="primary"
                                onClick={ onClickSave }
                                label={`${ isEditRole ? 'Save role' : 'Save password' }`}
                            />
                        </>
                        :
                        !hasRsAdminSecurityRole &&
                            <Button
                                buttonType="destructive"
                                onClick={ openModal }
                                label="Delete"
                            />
                    }
                </ButtonSection>
            </AdministrationContainer>

            <ModalDialog isOpen={isModalOpen}
                         onRequestClose={closeModal}
                         confirmButton={{
                             onConfirm: onClickDelete
                         }}
                         title="Are you sure you want to delete this user? Deletion will apply across all environments."
            />
        </WindowContainer>
    );
}

UserContent.defaultProps = {
    userService: defaultUserService
};

export default UserContent;