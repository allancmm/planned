import React, { FormEvent, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CollapseContainer, Loading, useLoading } from "equisoft-design-ui-elements";
import { Button, useModal } from '@equisoft/design-elements-react';
import { Pagination, DataGrid, DataGridWrapper, NoRecordsFound, List  } from "../../components/general";
import { defaultUserService, defaultEnvironmentService, defaultMigrationPathService } from '../../lib/context';
import { PanelTitle } from '../../components/general/sidebar/style';
import { SidebarContext } from "../../components/general/sidebar/sidebarContext";
import { useFocusedActiveTab, useTabActions } from '../../components/editor/tabs/tabContext';
import { OPEN } from '../../components/editor/tabs/tabReducerTypes';
import { User } from '../../lib/domain/entities/user';
import { SecurityRole } from "../../lib/domain/entities/securityRole";
import AdministrationUserSession from "../../lib/domain/entities/tabData/administrationUserSession";
import AdministrationUserGroupSession from "../../lib/domain/entities/tabData/administrationUserGroupSession";
import Pageable from "../../lib/domain/util/pageable";
import UserService from "../../lib/services/userService";
import { ModalUser, ModalUserGroup } from "./modal";
import {Container, Panel, AdmPanelContainer, UserPanelContainer} from './styles';
import EnvironmentService from "../../lib/services/environmentService";
import Environment from "../../lib/domain/entities/environment";
import OipaEnvironmentSession from "../../lib/domain/entities/tabData/oipaEnvironmentSession";
import { OperationMode } from "../../lib/domain/enums/operationMode";
import MigrationPathService from "../../lib/services/migrationPathService";
import { MigrationPath } from "../../lib/domain/entities/migrationPath";
import MigrationPathSession from "../../lib/domain/entities/tabData/migrationPathSession";
import { GridCellParams, GridColumns, GridPageChangeParams, GridResizeParams } from "@material-ui/data-grid";
import useDebouncedSearch from "../../components/general/hooks/useDebounceSearch";

interface AdministrationProps {
    userService: UserService,
    environmentService: EnvironmentService,
    migrationPathService: MigrationPathService
}

const Administration = ({ userService, environmentService, migrationPathService } : AdministrationProps) => {
    const [loading, load] = useLoading();
    const { refreshSidebar } = useContext(SidebarContext);
    const dispatch = useTabActions();

    const {
        isModalOpen : isModalAddUserOpen,
        closeModal: closeModalAddUser,
        openModal : openModalAddUser,
    } = useModal();

    const {
        isModalOpen : isModalAddUserGroupOpen,
        closeModal: closeModalAddUserGroup,
        openModal : openModalAddUserGroup,
    } = useModal();

    const dataGridRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<User[]>([]);

    const [, tabId] = useFocusedActiveTab();

    const idTabSelected = tabId?.match(/(?<=([a-z A-Z]) \- ).*/g)?.[0] ?? '';

    const [userGroups, setUserGroups ] = useState<SecurityRole[]>([]);
    const [oipaEnvironments, setOipaEnvironments] = useState<Environment[]>([]);
    const [migrationPaths, setMigrationPaths] = useState<MigrationPath[]>([]);
    const [pageUser, setPageUser] = useState(Pageable.withPageOfSize());
    const [pageUserGroup, setPageUserGroup] = useState(Pageable.withPageOfSize());
    const [rowsUser, setRowsUser] = useState<User[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const userSearchUser = () => useDebouncedSearch((searchParam: string) => {
        fetchUsers(searchParam);
    });

    const { inputText, setInputText, searchResults } = userSearchUser();

    const fetchUsers = (searchParam = '') => {
        load(async (newPage: Pageable) =>
            userService.getUserList(searchParam, newPage))(pageUser)
            .then(({ users: usersResp, page}) => {
                  setPageUser(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));
                  setUsers(usersResp);
                }
            );
    };

    const fetchUserGroups = (pageUserGroupParam: Pageable) => {
        load(async (newPage: Pageable) =>
            userService.getSecurityRolePage(newPage))(pageUserGroupParam).then(res => {
            const { securityRoles, page }  = res;
            pageUserGroupParam.totalElements = page.totalElements;
            setUserGroups(securityRoles);
        });
    }

    const fetchOipaEnvironments = () => {
        load(async () => {
            const { environments } = await environmentService.getEnvironmentList();
            setOipaEnvironments(environments);
        })();
    };

    const fetchMigrationPath = () => {
        load(async () => {
            const migrationPathsResp = await migrationPathService.getAllMigrationPath();
            setMigrationPaths(migrationPathsResp);
        })();
    };

    useEffect(() => {
        setRowsUser(users);
    }, [users]);

    useEffect(() => {
        if(!searchResults.loading){
            fetchUsers(inputText);
        }
    }, [pageUser.pageNumber, refreshSidebar]);

    useEffect(() => {
        fetchUserGroups(pageUserGroup);
    }, [pageUserGroup.pageNumber, refreshSidebar ]);

    useEffect(() => {
        fetchOipaEnvironments();
    }, [refreshSidebar]);

    useEffect(() => {
        fetchMigrationPath();
    }, [refreshSidebar]);

    useLayoutEffect(() => {
        setContainerSize({ width: dataGridRef?.current?.offsetWidth || 0, height: dataGridRef?.current?.offsetHeight || 0})
    }, [dataGridRef]);

    const handleOnClickUser = ({ row  } : GridCellParams) => {
        row && dispatch({ type: OPEN, payload: { data: new AdministrationUserSession( row as User ) } });
    }

    const handleOnClickUserGroup = (securityRoleGuid: string) => {
        const userGroupClicked = userGroups.find((u) => u.securityRoleGuid === securityRoleGuid);
        userGroupClicked && dispatch({ type: OPEN, payload: { data: new AdministrationUserGroupSession( userGroupClicked ) } });
    }

    const handleOnClickEnvironment = (identifier: string) => {
        const env = oipaEnvironments.find((u) => u.identifier === identifier);
        env && dispatch({ type: OPEN, payload: { data: new OipaEnvironmentSession( env, 'READ' ) } });
    }

    const handleOnClickMigration = (identifier: string) => {
        const m = migrationPaths.find((u) => u.identifier === identifier);
        m && dispatch({ type: OPEN, payload: { data: new MigrationPathSession( m, 'READ' ) } });
    }

    const openTabOipaEnvironment = (env: Environment, operationMode: OperationMode) =>
        dispatch({ type: OPEN, payload: { data: new OipaEnvironmentSession(env, operationMode) }});

    const openTabMigrationPath = (migrationPath: MigrationPath, operationMode: OperationMode) =>
        dispatch({ type: OPEN, payload: { data: new MigrationPathSession(migrationPath, operationMode) }});

    const handleClickOpenModal = (e: FormEvent<HTMLFormElement>, openModal : () => void) => {
        e.stopPropagation();
        openModal();
    }

    const columnsUser: GridColumns = [
        { field: 'userName',
            headerName: 'User Name',
            description: 'User name',
            flex: 1,
            hideSortIcons: true,
            sortable: false
        },
        { field: 'securityRole',
            headerName: 'Role',
            description: 'Role',
            flex: 1,
            hideSortIcons: true,
            sortable: false,
            hide: containerSize.width < 250,
            valueGetter: ({ row }) => row.securityRole.securityRoleName}
    ];

    const heightDataGrid = useMemo(() => rowsUser.length > 0 ? ((rowsUser.length - 1) * 36 + 210) : 230, [rowsUser.length]);

    const usersContent = () =>
        <DataGridWrapper>
            <CollapseContainer title="Users"
                               actions={
                                   <Button
                                       buttonType="tertiary"
                                       onClick={ (e: FormEvent<HTMLFormElement>) => handleClickOpenModal(e, openModalAddUser) }
                                       label="+ ADD"
                                   />
                               }
                               defaultOpened>
                <UserPanelContainer heightDataGrid={heightDataGrid} ref={dataGridRef}>
                    <DataGrid
                        id='userGuid'
                        rows={rowsUser}
                        columns={columnsUser}
                        pageSize={5}
                        onCellClick={handleOnClickUser}
                        onResize={(param : GridResizeParams) => {
                            param.containerSize && setContainerSize(param.containerSize);
                        }}
                        searchText={inputText}
                        requestSearch={setInputText}
                        isShowInputFilter
                        disableColumnMenu
                        paginationMode='server'
                        rowCount={pageUser.totalElements}
                        onPageChange={(param: GridPageChangeParams) => {
                            setPageUser(Pageable.withPageOfSize(param.pageSize, param.page, param.rowCount));
                        }}
                        disableMultipleColumnsFiltering
                    />
                </UserPanelContainer>
            </CollapseContainer>
        </DataGridWrapper>

    const userGroupsContent = () =>
        <CollapseContainer title="User Groups"
                           actions={
                               <Button
                                   buttonType="tertiary"
                                   onClick={ (e: FormEvent<HTMLFormElement>) => handleClickOpenModal(e, openModalAddUserGroup) }
                                   label="+ ADD"
                               />
                           }>
            <AdmPanelContainer>
                <List
                    options={userGroups.map((ug) => ({ label: ug.securityRoleName, value: ug.securityRoleGuid }))}
                    onClick={handleOnClickUserGroup}
                    selectedItems={[idTabSelected]}
                    className='list-container'
                />
                {userGroups?.length > 0 ?
                    <Pagination
                        className='pagination-custom'
                        activePage={pageUserGroup.getPageNumber() + 1}
                        totalPages={pageUserGroup.getTotalPage() + 1}
                        numberOfResults={pageUserGroup.totalElements}
                        pagesShown={1}
                        onPageChange={(pageNumber: number) => {
                            setPageUserGroup(Pageable.withPageOfSize(pageUserGroup.size, pageNumber - 1, pageUserGroup.totalElements))
                        }}
                        disabled={loading}
                    />
                    :
                    <NoRecordsFound />
                }
            </AdmPanelContainer>
        </CollapseContainer>

    const oipaEnvironmentContent = () =>
        <CollapseContainer title='Environments'
                           actions={
                               <Button
                                   buttonType="tertiary"
                                   onClick={ (e: FormEvent<HTMLFormElement>) => {
                                       e.stopPropagation();
                                       openTabOipaEnvironment(new Environment(), 'CREATE');
                                   }
                                   }
                                   label="+ ADD"
                               />
                           }>
            <AdmPanelContainer>
                <List
                    options={oipaEnvironments.map((env) => ({ label: env.displayName, value: env.identifier }))}
                    onClick={handleOnClickEnvironment}
                    selectedItems={[idTabSelected]}
                    className='list-container'
                />

                {oipaEnvironments?.length === 0 && <NoRecordsFound /> }
            </AdmPanelContainer>
        </CollapseContainer>;

    const migrationPathContent = () =>
        <CollapseContainer title='Migration Path'
                           actions={
                               <Button
                                   buttonType="tertiary"
                                   onClick={ (e: FormEvent<HTMLFormElement>) => {
                                       e.stopPropagation();
                                       openTabMigrationPath(new MigrationPath(), 'CREATE');
                                     }
                                   }
                                   label="+ ADD"
                               />
                           }>
            <AdmPanelContainer>
                <List
                    options={migrationPaths.map((m) => ({ label: m.displayName, value: m.identifier }))}
                    onClick={handleOnClickMigration}
                    selectedItems={[idTabSelected]}
                    className='list-container'
                />
                {migrationPaths?.length === 0 && <NoRecordsFound /> }
            </AdmPanelContainer>
        </CollapseContainer>;

    return (
        <>
            <PanelTitle>Administration</PanelTitle>
            <Loading loading={loading} />
            <Container>
                <Panel>
                    {usersContent()}
                </Panel>

                <Panel>
                    {userGroupsContent()}
                </Panel>

                <Panel>
                    {oipaEnvironmentContent()}
                </Panel>

                <Panel>
                    {migrationPathContent()}
                </Panel>
            </Container>

            {isModalAddUserOpen &&
                <ModalUser closeModal={closeModalAddUser}
                           onConfirm={fetchUsers}
                />
            }

            {isModalAddUserGroupOpen &&
                <ModalUserGroup
                    typeMode="Add"
                    closeModal={ closeModalAddUserGroup }
                    onConfirm={ () => fetchUserGroups(pageUserGroup) }
                />
            }
        </>
    );
};

Administration.defaultProps = {
    environmentService: defaultEnvironmentService,
    userService: defaultUserService,
    migrationPathService: defaultMigrationPathService
};

export default Administration;
