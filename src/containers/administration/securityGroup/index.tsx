import React, { useEffect } from 'react';
import produce from "immer";
import { WindowContainer, useLoading, Loading } from 'equisoft-design-ui-elements';
import { toast } from 'react-toastify';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { defaultOipaUserService } from '../../../lib/context';
import OIPASecurityGroupSession from '../../../lib/domain/entities/tabData/oipaSecurityGroupSession';
import OipaUserService from '../../../lib/services/oipaUserService';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { EDIT_TAB_DATA } from "../../../components/editor/tabs/tabReducerTypes";

interface OipaSecurityContentProps {
    oipaUserService: OipaUserService,
    tabId: string;
}

const OipaSecurityContent = ({ oipaUserService, tabId }: OipaSecurityContentProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const { data } = tab;
    const [loading, load] = useLoading();

    if (!(data instanceof OIPASecurityGroupSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { securityGroupManagement } = data ;

    useEffect(() => {
        if(securityGroupManagement.length === 0){
            fetchSecurityGroups();
        }
    }, []);

    const fetchSecurityGroups = () => {
        load(async () => {
            const result = await oipaUserService.getSecurityGroupsAndCompany();
            dispatch({ type: EDIT_TAB_DATA,
                payload: { tabId,
                    data:  produce(data, (draft) => {
                            draft.securityGroupManagement = result.securityGroups;
                        }
                    ) } });
        })();
    };

    const columns: DataTableColumn[] = [
        { name: 'Group name', selector: 'securityGroupName' },
        { name: 'Primary Company', selector: 'primaryCompany.companyName' },
    ];

    return (
        <WindowContainer>
            <Loading loading={loading} />

            <DataTable
                columns={columns}
                data={securityGroupManagement}
                keyColumn='securityGroupName'
                defaultSortColumn='securityGroupName'
                hasSearchBar
                placeHolderSearchBar='Search Security Group'
            />
        </WindowContainer>
    );
}


OipaSecurityContent.defaultProps = {
    oipaUserService: defaultOipaUserService,
};

export default OipaSecurityContent;