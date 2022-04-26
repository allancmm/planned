import React, {useContext, useEffect, useState} from "react";
import {Loading, useLoading, WindowContainer} from 'equisoft-design-ui-elements';
import {Button, useModal} from "@equisoft/design-elements-react";
import ModalDialog from "../../../components/general/modalDialog";
import {Grid, IconButton, Tooltip} from "@material-ui/core";
import {faUserEdit, faUserSlash} from '@fortawesome/free-solid-svg-icons';

import {TabContext, useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {toast} from "react-toastify";
import OipaUserSession from "../../../lib/domain/entities/tabData/oipaUserSession";
import OipaUserService from "../../../lib/services/oipaUserService";
import {defaultOipaUserService} from "../../../lib/context";
import Pageable from "../../../lib/domain/util/pageable";
import OipaUser from "../../../lib/domain/entities/oipaUser";
import DataTable, {DataTableColumn} from "../../general/dataTable/table";
import {ActionIcon, ButtonContent} from "./style";
import {getConvertedLocale} from "../../../lib/domain/util/convertLocales";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {RightbarContext} from "../../../components/general/sidebar/rightbarContext";
import {UserStatusEnum} from "../../../lib/domain/enums/userStatus";
import {ButtonSection} from "../styles";
import {EDIT_TAB_DATA} from "../../../components/editor/tabs/tabReducerTypes";
import produce from "immer";

const useStyles = makeStyles(() =>
    createStyles({
        styleCell: {
            minWidth: 200,
        }
    }),
);

const localeCell = (row: OipaUser) => <span>{getConvertedLocale(row.localCode)}</span>;

const securityGroupCell = (row: OipaUser ) => (
         row.userSecurityGroups.map((group ) =>
            <li key={group.securityGroupGuid}>
                {group.securityGroupName}
            </li>
         )
);

const statusCell = (row: OipaUser) => <span>{`${ row.userStatus === UserStatusEnum.ACTIVE ? "Active" : "Inactive"}`}</span>

interface OipaUserContentProps {
   tabId: string,
   oipaUserService: OipaUserService
}

const OipaUserContent = ({ tabId, oipaUserService } : OipaUserContentProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof OipaUserSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const dispatch = useTabActions();

    const { oipaUserList: { users, page } } = data;

    const [loading, load] = useLoading();

    const { openRightbar } = useContext(RightbarContext);

    const { refreshTab } = useContext(TabContext);

    const classes = useStyles();

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const [user, setUser] = useState<OipaUser>(new OipaUser());

    const [pageUser, setPageUser] = useState<Pageable>(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));

    const [showPaginator, setShowPaginator] = useState<boolean>(true);

    const updateFields = (newData: OipaUserSession) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: newData
            }
        });
    }

    const fetchUserList =
        load(async () => {
            const resp = await oipaUserService.getUserList(pageUser || Pageable.withPageOfSize());
            setPageUser(resp.page);
            setShowPaginator(true);
            updateFields(produce(data, (draft) => {
                draft.oipaUserList = resp
            }));
        });

    const inactivateUser = load(async () => oipaUserService.inactivateUser(user));

    const searchUserLoginName = load(async (searchParam: string) => oipaUserService.getUserByLoginName(searchParam));

    useEffect(() => {
        pageUser && fetchUserList();
    }, [pageUser?.pageNumber, pageUser?.size, refreshTab]);

    const addUser = () => {
        openRightbar('Manipulate_Oipa_User',  { isEdit: false, userOipa: new OipaUser() });
    };

    const onClickInactivate = (userDelete: OipaUser) => {
       setUser(userDelete);
       openModal();
    }

    const onClickEdit = (userEdit: OipaUser) => {
        openRightbar('Manipulate_Oipa_User', { isEdit: true, userOipa: userEdit })
    }
    const onConfirm = async () => {
        await inactivateUser();
        closeModal();
        toast.success('User inactivated successfully');
        fetchUserList();
    };

    const onChangeSearchBar = async (loginNameSearch: string) => {
        if(loginNameSearch.length === 0) {
            fetchUserList();
            return;
        }

        if(loginNameSearch.length > 2) {
            const usersResp = await searchUserLoginName(loginNameSearch);
            updateFields(produce(data, (draft) => {
                draft.oipaUserList.users = usersResp
            }));
            setShowPaginator(false);
        }
    }

    const actionsCell = (row: OipaUser) =>
        <ButtonSection>
            <Grid container>
                <Grid item xs={6}>
                    {row.userStatus === UserStatusEnum.ACTIVE &&
                        <Tooltip title={`Inactivate ${row.clientNumber}`}>
                            <ButtonContent>
                                <IconButton aria-label="inactivate" size="small" onClick={onClickInactivate.bind(null, row)}>
                                    <ActionIcon  icon={ faUserSlash } />
                                </IconButton>
                            </ButtonContent>
                        </Tooltip>
                    }
                </Grid>
                <Grid item xs={6}>
                    <Tooltip title={`Edit ${row.clientNumber}`}>
                        <ButtonContent isEdit>
                            <IconButton aria-label="edit" size="small"  onClick={onClickEdit.bind(null, row)}>
                                <ActionIcon  icon={ faUserEdit } />
                            </IconButton>
                        </ButtonContent>
                    </Tooltip>
                </Grid>
            </Grid>
        </ButtonSection>

    const columns: DataTableColumn[] = [
        { name: 'Login Name', selector: 'clientNumber'},
        { name: 'First name', selector: 'firstName' },
        { name: 'Last Name', selector: 'lastName' },
        { name: 'Company', selector: 'company.companyName' },
        { name: 'Locale', selector: 'localCode', cell: localeCell },
        { name: 'Security Group', selector: 'userSecurityGroups', cell: securityGroupCell, styleCell: classes.styleCell },
        { name: 'Status', selector: 'userStatus', cell: statusCell  },
        { name: 'Actions', selector: '', cell: actionsCell }
    ];

    return (
        <WindowContainer>
            <Loading loading={loading} />

            <DataTable
                columns={columns}
                data={users}
                keyColumn='clientGuid'
                defaultSortColumn='clientNumber'
                hasSearchBar
                placeHolderSearchBar={'Search login or name...'}
                onChangeSearchBar={onChangeSearchBar}
                actions={
                    <Button buttonType="tertiary" onClick={addUser}>
                        + Add User
                    </Button>
                }
                page={showPaginator ? pageUser : undefined}
                setPage={showPaginator ? setPageUser : undefined}
            />

            <ModalDialog isOpen={isModalOpen}
                         onRequestClose={closeModal}
                         title="Inactivate user"
                         subtitle="Are you sure you want to Inactivate this user?"
                         confirmButton={{ onConfirm }}
            >
                <Loading loading={loading} />
            </ModalDialog>
        </WindowContainer>
    );
}

OipaUserContent.defaultProps = {
    oipaUserService: defaultOipaUserService
}

export default OipaUserContent;