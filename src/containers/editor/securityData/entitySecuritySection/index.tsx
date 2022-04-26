import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import produce, {Draft} from 'immer';
import {Loading, useLoading} from 'equisoft-design-ui-elements';
import { GridCellParams, GridColDef, GridColumns, GridPageChangeParams} from '@material-ui/data-grid';
import { DataGrid, Switch, InputText } from "../../../../components/general";
import {FormControlLabel} from '@material-ui/core';
import {defaultSecurityGroupService} from '../../../../lib/context';
import SecurityGroupDataDetails from '../../../../lib/domain/entities/securityGroupDataDetail';
import SecurityGroupService from '../../../../lib/services/securityGroupService';
import GenericRuleField from '../../../../lib/domain/entities/genericRuleField';
import {EntityTypeSecurityGroup} from '../../../../lib/domain/enums/entityTypeSecurityGroup';
import Access from '../../../../lib/domain/enums/yesNo';
import {OverrideTypeCodeEnum} from '../../../../lib/domain/enums/overrideType';
import {AccessAllContent, DataGridContainer, SecurityDataContent} from '../style';
import {useTabActions, useTabWithId} from '../../../../components/editor/tabs/tabContext';
import {EDIT_USER_DATA} from '../../../../components/editor/tabs/tabReducerTypes';

const PRODUCT_TRANSACTION = 'Product';
const ALLOW_PAGE = 'Allow Page';

interface SecurityGroupList {
    [id: string]: SecurityGroupDataDetails[];
}

interface CompanyPageSecuritySectionProps {
    isEditMode: boolean;
    securityService: SecurityGroupService;
    entityGuid: string;
    securityGroupGuid: string;
    planGuidChosen: string;
    overrideTypeCode: string;
    entityType: EntityTypeSecurityGroup;
    tabId: string;
    dataFields: GenericRuleField[];
    forceUpdate: boolean;

    updateSecurityGroupData(details: SecurityGroupDataDetails[],
                            grantAccessAll: boolean): void;
}

export const CompanyPageSecuritySection = ({
                                               isEditMode,
                                               securityService,
                                               entityGuid,
                                               entityType,
                                               securityGroupGuid,
                                               planGuidChosen,
                                               overrideTypeCode,
                                               dataFields,
                                               tabId,
                                               forceUpdate,
                                               updateSecurityGroupData
                                           }: CompanyPageSecuritySectionProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);

    const {userData: {companyPageOptions = {}}} = tab;

    const [loading, load] = useLoading();
    const [buttons, setButtons] = useState<SecurityGroupDataDetails[]>([]);
    const [accessAll, setAccessAll] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(20);

    const handlePageSizeChange = (params: GridPageChangeParams) => {
        setPageSize(params.pageSize);
    };

    const updateListButtons = (recipe: (draft: Draft<SecurityGroupDataDetails[]>) => void) => {
        setButtons(produce(buttons, recipe));
    };

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        updateListButtons((draft) => {
            const i = draft.findIndex((e) => e.id === id);
            if (i >= 0) {
                draft[i] = {...draft[i], access: event.target.checked ? Access.Yes : Access.No};
                const selectedSC: SecurityGroupDataDetails = draft[i];
                if (selectedSC.access === Access.No && selectedSC.buttonName === ALLOW_PAGE) {
                    draft.filter(sc => sc.pageName === selectedSC.pageName).forEach(sc => {
                        const index = draft.findIndex((e) => e.id === sc.id);
                        if (index >= 0) {
                            draft[index] = {...draft[index], access: Access.No};
                        }
                    });
                } else if (selectedSC.access === Access.Yes) {
                    const index = draft.findIndex(sc => sc.pageName === selectedSC.pageName && sc.buttonName === ALLOW_PAGE);
                    if (index >= 0) {
                        draft[index] = {...draft[index], access: Access.Yes};
                    }
                }

            }
        });
    };

    const renderAccess = (params: GridCellParams) =>
        <FormControlLabel
            control={
                <Switch checked={params.row.access === Access.Yes}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeSwitch(event, parseInt(params.row.id, 10))}
                        name="accessSwitch" color="primary"
                        disabled={!isEditMode || loading}
                />
            }
            label={params.row.access}
        />;

    const renderButtonName = (params: GridCellParams) => {
        const buttonName = params.row.buttonName
        return buttonName === ALLOW_PAGE ? <strong>{buttonName}</strong> : buttonName
    }

    const columnsWithPage: GridColumns = [
        {field: 'pageName', headerName: 'Page Name', sortable: false, flex: 1, editable: false},
        {field: 'buttonName', headerName: 'Button Name', flex: 1, editable: false, renderCell: renderButtonName},
        {field: 'access', headerName: 'Access', flex: 1, editable: false, renderCell: renderAccess}
    ];

    const columns: GridColDef[] = [
        {field: 'buttonName', headerName: 'Button Name', flex: 1, editable: false},
        {field: 'access', headerName: 'Access', flex: 1, editable: false, renderCell: renderAccess}
    ];

    const productGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'ProductGUID')?.value || '', [dataFields]);

    const companyGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'CompanyGUID')?.value || '', [dataFields]);

    const inquiryScreenNameGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'InquiryScreenNameGUID')?.value || '', [dataFields]);

    const planGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'PlanGUID')?.value || '', [dataFields]);

    const isProductTransaction = OverrideTypeCodeEnum.getEnumFromCode(overrideTypeCode).value === PRODUCT_TRANSACTION;

    const getSecurityData = async (call: Function) => {
        setButtons([]);
        const list = await call();
        setButtons(buildButtonList(list, attributes[entityType]?.level));
    };

    const onChangeSecurityGroup = load(async () => {
        if (!securityGroupGuid) {
            setButtons([]);
            return;
        }
        await getSecurityData(attributes[entityType]?.onChange);
    });


    const updateListGroup = (recipe: (draft: Draft<SecurityGroupList>) => void) => {
        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                name: 'companyPageOptions',
                value: produce(companyPageOptions, recipe)
            }
        });
    };

    useEffect(() => {
        if (buttons.length > 0) {
            const isAllWithAccess = !buttons.find((btn) => btn.access !== Access.Yes);
            setAccessAll(isAllWithAccess);
            updateSecurityGroupData(buttons, isAllWithAccess);
        } else setAccessAll(false);
    }, [buttons]);

    useEffect(() => {
        if (forceUpdate || !companyPageOptions[securityGroupGuid + planGuidChosen]) {
            onChangeSecurityGroup();
        } else {
            setButtons(companyPageOptions[securityGroupGuid + planGuidChosen]);
        }
    }, [securityGroupGuid, planGuidChosen, forceUpdate]);

    useEffect(() => {
        if (securityGroupGuid && buttons.length > 0) {
            updateListGroup((draft) => {
                draft[securityGroupGuid + planGuidChosen] = buttons;
            });
        }
    }, [securityGroupGuid, buttons]);

    const handleSecurityByTransaction = load(async () => {
            if (isProductTransaction) {
                if (planGuidChosen) {
                    return securityService.getPlanProductTransactionSecurity(entityGuid, planGuidChosen, securityGroupGuid);
                }
                return securityService.getProductTransactionSecurity(entityGuid, securityGroupGuid);
            }
            return securityService.getPlanTransactionSecurity(entityGuid, securityGroupGuid);
        }
    );

    const handleSecurityByInquiry = load(async () => {
        if (productGUID) {
            return securityService.getProductSecurityInquiry(inquiryScreenNameGUID, productGUID, securityGroupGuid);
        } else if (planGUID) {
            return securityService.getPlanSecurityInquiry(inquiryScreenNameGUID, planGUID, securityGroupGuid);
        } else {
            return securityService.getCompanySecurityInquiry(inquiryScreenNameGUID, companyGUID, securityGroupGuid);
        }
    });

    const handleSecurityByCompany = load(async () =>
        securityService.getCompanySecurity(entityGuid, securityGroupGuid)
    );

    const handleSecurityByPlan = load(async () => {
        if (productGUID || entityType === 'INQUIRY_SCREEN') {
            return securityService.getPlanSecurity(entityGuid, securityGroupGuid);
        }
        return securityService.getPlanSecurityByParentPlan(entityGuid, securityGroupGuid);
    });

    const handleSecurityByProduct = load(async () => {
        if (planGuidChosen) {
            return securityService.getPlanProduct(entityGuid, planGuidChosen, securityGroupGuid);
        }
        return securityService.getProductSecurity(entityGuid, securityGroupGuid);
    });

    const buildButtonList = (listParam: Record<string, string | Record<string, string>>, level: number) => {
        let index = 0;
        let listRecord;
        const detailsList: SecurityGroupDataDetails[] = [];
        if (level === 1) {
            listRecord = (listParam as Record<string, string>);
            Object.entries(listRecord).forEach((entry) => {
                const [buttonName, access] = entry;
                detailsList.push(new SecurityGroupDataDetails(index++, buttonName, access));
            });
            return detailsList;
        }

        listRecord = (listParam as Record<string, Record<string, string>>);
        Object.entries(listRecord).forEach((entry) => {
            const [pageName, subKeys] = entry;
            Object.entries(subKeys).forEach(([buttonName, access]) => {
                detailsList.push(new SecurityGroupDataDetails(index++, buttonName, access, pageName));
            });
        });
        return detailsList;
    };

    const attributes = {
        'TRANSACTIONS': {
            onChange: handleSecurityByTransaction,
            level: 1,
            columns
        },
        'PLAN': {
            onChange: handleSecurityByPlan,
            level: 2,
            columns: columnsWithPage
        },
        'INQUIRY_SCREEN': {
            onChange: handleSecurityByInquiry,
            level: 1,
            columns
        },
        'COMPANY': {
            onChange: handleSecurityByCompany,
            level: 2,
            columns: columnsWithPage
        },
        'PRODUCT': {
            onChange: handleSecurityByProduct,
            level: 2,
            columns: columnsWithPage
        }
    };

    const switchMode = ({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
        setAccessAll(checked);
        setButtons(buttons.map((btn) => ({
                ...btn,
                access: checked ? Access.Yes : Access.No
            })
        ));
    };

    const disableCheckboxGrantAccessAll = (): boolean =>
        loading ||
        !isEditMode ||
        buttons.length === 0;

    return (
        <>
            <Loading loading={loading}/>
            <SecurityDataContent>
                <AccessAllContent>
                    <InputText
                        type="checkbox"
                        options={[{label: 'Grant access all', value: 'accessAll', disabled: disableCheckboxGrantAccessAll()}]}
                        checkedValues={[accessAll ? 'accessAll' : '']}
                        onChange={switchMode}
                        disabled={disableCheckboxGrantAccessAll()}
                    />
                </AccessAllContent>

                <DataGridContainer>
                    <DataGrid
                        id='id'
                        density="compact"
                        rows={buttons}
                        columns={attributes[entityType].columns}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                    />
                </DataGridContainer>
            </SecurityDataContent>
        </>
    );
};

CompanyPageSecuritySection.defaultProps = {
    securityService: defaultSecurityGroupService
};

export default CompanyPageSecuritySection;