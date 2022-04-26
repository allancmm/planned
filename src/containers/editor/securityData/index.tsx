import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import usePrevious from "../../../components/general/hooks/usePrevious";
import {CollapseContainer, Loading, useLoading, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import {toast} from 'react-toastify';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA, EDIT_USER_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import AuthSecurityGroupData from '../../../lib/domain/entities/authSecurityGroupData';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import CompanyPageSecuritySection from './entitySecuritySection';
import SecurityGroupDataDetail from "../../../lib/domain/entities/securityGroupDataDetail";
import {buildSecurityGroupData} from "../../../lib/infra/assembler/securityGroupDataAssembler";
import {EntityTypeSecurityGroup} from "../../../lib/domain/enums/entityTypeSecurityGroup";
import SecurityGroupData from "../../../lib/domain/entities/securityGroupData";
import AuthSecuritySection from "./authSecuritySection";
import { Grid } from "@material-ui/core";
import {OverrideTypeCodeEnum} from "../../../lib/domain/enums/overrideType";
import {defaultBasicEntityService, defaultEntitiesService, defaultSecurityGroupService} from "../../../lib/context";
import EntityService from "../../../lib/services/entitiesService";
import SecurityGroupService from "../../../lib/services/securityGroupService";
import BasicEntityService from "../../../lib/services/basicEntityService";
import InputText, {Options} from "../../../components/general/inputText";
import {CompanyAccessContent, SecurityGroupListContent} from "./style";
import AuthSecurity from "../../../lib/domain/entities/authSecurity";
import CompanySecurityData from "../../../lib/domain/entities/companySecurityData";
import BasicEntity from "../../../lib/domain/entities/basicEntity";
import AuthCompanyWebServiceSection from "./authCompanyWebServiceSection";
import AuthCompanyWebService from "../../../lib/domain/entities/authCompanyWebService";
import Access from "../../../lib/domain/enums/yesNo";
import AuthCompanyWebServiceData from "../../../lib/domain/entities/authCompanyWebServiceData";
import { validEntityTypePageSecurity, EntityTypePageSecurityEnum, entitiesAuthSecurity, AuthSecurityType } from "../../../lib/domain/enums/entityTypePageSecurity"

const PRODUCT_TRANSACTION = 'Product';
const GLOBAL = 'Global';

interface AuthCompanyList {
    [id: string]: AuthCompanyWebService[]
}

interface AuthSecurityInterface {
    [id: string]: AuthSecurity[]
}

interface CompanyAccess {
  [id: string]: boolean
}

interface EntitySecurityDataProps {
    entityService: EntityService;
    basicEntityService: BasicEntityService,
    securityService: SecurityGroupService;
    tabId: string;
    header?: React.ReactNode;
}

export const EntitySecurityData = ({ entityService, securityService, tabId, header, basicEntityService }: EntitySecurityDataProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);

    const { data, userData } = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const [loading, load] = useLoading();

    const { entityType,
            dataFields,
            primaryCompany,
            oipaRule: { ruleGuid, ruleName },
            status: { readOnly, status },
            maskSecurityLevelCodes,
            fieldSecurityLevelCodes,
            overrideTypeCode, extras: { reloadContent = false } } = data;

    const { securityGroupGuid = '',
            planGuidOverride = '',
            authCompanyWebServiceList = {},
            maskSecuritiesOptions = {},
            fieldSecuritiesOptions = {},
            securityGroups = [],
            primaryCompanyList=[],
            availablePlansOptions = [],
            companyHasAccess = {}
          } = userData;

    const prevStatus = usePrevious(status);

    const forceUpdate = prevStatus !== status || reloadContent;

    const companyGuidTransaction = data.getCompanyGuid();

    const productTransactionGuid = data.getProductTransactionGuid();

    const [showMessageRemoveAccess, setShowMessageRemoveAccess] = useState<boolean>(false);

    const [primaryCompanySelected, setPrimaryCompanySelected] = useState<string>('');

    const isShowCompanySecurity = entityType === 'COMPANY';

    const isOverrideProduct = OverrideTypeCodeEnum.getEnumFromCode(overrideTypeCode).value === PRODUCT_TRANSACTION;

    const isShowOverrides = isOverrideProduct || entityType === 'PRODUCT';

    const isShowAuthSecurities = entitiesAuthSecurity.includes(entityType);

    const isShowEntityPageSecurity = useMemo(() =>
        validEntityTypePageSecurity.filter(v => v.code === entityType).length > 0 &&
        (entityType !== 'COMPANY' || primaryCompany), [entityType, primaryCompany]);

    const companyGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'CompanyGUID')?.value || '', [dataFields]);

    const productGUID = useMemo(() =>
        dataFields.find((a) => a.name === 'ProductGUID')?.value || '', [dataFields]);

    const planInquiryGuid = useMemo(() =>
        dataFields.find((a) => a.name === 'PlanGUID')?.value || '', [dataFields]);

    const maskSecurityLevelCodesOptions =
        useMemo(() => maskSecurityLevelCodes.map( m => new Options(m.name, m.value)),
            [maskSecurityLevelCodes]);

    const fieldSecurityLevelCodesOptions =
        useMemo(() => [...fieldSecurityLevelCodes.map( m => new Options(m.name, m.value)),
                                new Options('No security', '99')],
            [fieldSecurityLevelCodes]);

    const fetchSecurityGroupOptions = () => {
        if(securityGroups.length === 0){
            load(async () => {
                if(entitiesAuthSecurity.includes(entityType)){
                    await fetchSecurityGroupOptionsByCompanyGuid(companyGuidTransaction);
                    return;
                }
                await fetchSecurityGroupOptionsByCompanyGuid(companyGUID);
            })();
           
        }
    };

    const fetchPrimaryCompany = ()=> {
            load(async () => {
                const listBasicEntities = await basicEntityService.getPrimaryCompanies().catch(() => []);

        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                name: 'primaryCompanyList',
                value: [{label: 'Select one', value: ''}].concat(listBasicEntities.map(({ name, value}) =>
                                                                 new Options(name, value)))
            }
        });
            })();
    };

    const fetchAvailablePlans = () => {
        if(availablePlansOptions.length === 0){
            load(async () => {
                const plans = await entityService.getAvailableChildPlans(productTransactionGuid || productGUID);
                dispatch({
                    type: EDIT_USER_DATA,
                    payload: {
                        tabId,
                        name: 'availablePlansOptions',
                        value: [{label: 'This product', value: ''},
                            ...plans.map((p) => ({ label: p.planName, value: p.planGuid }))]
                    }
                });
            })();
        }
    };

    const fetchSecurityGroupOptionsByCompanyGuid = async (companyGuid: string) => {
        let listBasicEntities: BasicEntity[];
        if(companyGuid){
            listBasicEntities = await entityService.getSecurityGroups(companyGuid);
        } else {
            listBasicEntities = [new BasicEntity('Not found', '')];
        }

        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                name: 'securityGroups',
                value: [{label: 'Select one', value: ''}].concat(listBasicEntities.map(({ name, value}) =>
                                                                 new Options(name, value)))
            }
        });
    };

    const resetSecurityGroup = () => {
        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                name: 'securityGroups',
                value: [{label: 'Select one', value: ''}]
            }
        });
    }

    const fetchAuthSecurities = async (field : AuthSecurityInterface,
                                       name: 'maskSecuritiesOptions' | 'fieldSecuritiesOptions',
                                       getApi: Function) => {
        if(!securityGroupGuid){
            return;
        }

        if (forceUpdate || !field[keyAuthSecurity]) {
            const values = data.oipaRule.override.overrideName === GLOBAL ? await load(async () => getApi(entityType, ruleGuid, securityGroupGuid, planGuidOverride, primaryCompanySelected))()
            :await load(async () => getApi(entityType, ruleGuid, securityGroupGuid, planGuidOverride))();
            dispatch({
                type: EDIT_USER_DATA,
                payload: {
                    tabId,
                    name,
                    value: produce(field, (draft) => {
                        draft[keyAuthSecurity] = values;
                    })
                }
            });
        }
    }

    const fetchCompanySecurity = async () => {
        if(!securityGroupGuid){
            return;
        }

        // if it's false, not call the api again
        if(forceUpdate ||
           companyHasAccess[securityGroupGuid] === undefined ||
           companyHasAccess[securityGroupGuid] === null){
            const respCompanyAccess = await load(async () => securityService.getCompanySecurityAccess(companyGUID, securityGroupGuid))();

            dispatch({
                type: EDIT_USER_DATA,
                payload: {
                    tabId,
                    name: 'companyHasAccess',
                    value: produce(companyHasAccess as CompanyAccess, (draft) => {
                        draft[securityGroupGuid] = respCompanyAccess[ruleName] === Access.Yes
                    })
                }
            });
        }

    }

    const fetchAuthCompanyWebService = async () => {
        if(!securityGroupGuid){
            return;
        }

        if(forceUpdate || !authCompanyWebServiceList[securityGroupGuid]){
            const webServiceDetails : Record<string, any> = await load(async () => securityService.getAuthCompanyWebService(companyGUID, securityGroupGuid))();
            const authCompanyWebServices: AuthCompanyWebService[] = [];

            Object.entries(webServiceDetails).forEach((entry, i) => {
                const [webServiceName, access] = entry;
                authCompanyWebServices.push(new AuthCompanyWebService(i, webServiceName, access));
            });

            dispatch({
                type: EDIT_USER_DATA,
                payload: {
                    tabId,
                    name: 'authCompanyWebServiceList',
                    value: produce(authCompanyWebServiceList as AuthCompanyList, (draft) => {
                        draft[securityGroupGuid] = authCompanyWebServices;
                    }),
                },
            });
        }
    };

    const handleCompanySecurityChange = (hasAccess: boolean) => {
        if(companyHasAccess[securityGroupGuid] && !hasAccess){
           setShowMessageRemoveAccess(true);
        } else {
            dispatch({
                type: EDIT_USER_DATA,
                payload: {
                    tabId,
                    name: 'companyHasAccess',
                    value: produce(companyHasAccess as CompanyAccess, (draft) => {
                        draft[securityGroupGuid] = hasAccess
                    })
                }
            });
            updateCompanySecurity(hasAccess);
       }
    };

    const updateAuthCompanyWebService = (webServiceName: string, hasAccess: boolean, grantAccessAll?: boolean) => {
        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                name: 'authCompanyWebServiceList',
                value: produce(authCompanyWebServiceList as AuthCompanyList, (draft) => {
                    if(grantAccessAll){
                        draft[securityGroupGuid].forEach((auth) => auth.access = Access.Yes);
                    } else {
                        const index = draft[securityGroupGuid].findIndex( (auth) => auth.webServiceName === webServiceName);
                        if(index > -1) {
                            draft[securityGroupGuid][index].access = hasAccess ? Access.Yes : Access.No;
                        }
                    }

                })
            }
        });
    }

    const updateCompanySecurity = (hasAccess: boolean) => {
        dispatch({ type: EDIT_TAB_DATA,
                      payload: { tabId,
                                 data:  produce(data, (draft) => {
                                     const index = draft.companySecurityData.findIndex((c) => c.securityGroupGuid === securityGroupGuid);
                                     if(index >= 0) {
                                         draft.companySecurityData[index].securityDetail = {hasAccess};
                                     } else draft.companySecurityData.push(new CompanySecurityData(ruleGuid, entityType, securityGroupGuid, {hasAccess})) ;
                                 }) } });
    }

    const updateSecurityGroupData = (securityGroupDataDetails: SecurityGroupDataDetail[],
                                     grantAccessAll: boolean) => {
        dispatch({ type: EDIT_TAB_DATA,
            payload: { tabId,
                data: produce(data, (draft) => {
                    const securityDataGroup : SecurityGroupData =
                        buildSecurityGroupData(securityGroupDataDetails,
                            grantAccessAll,
                            securityGroupGuid,
                            ruleGuid,
                            entityType as EntityTypeSecurityGroup,
                            data.getPlanGuid(),
                            data.getOverrideTypeCode(),
                            planGuidOverride,
                            companyGUID,
                            planInquiryGuid,
                            productGUID);

                    let index;
                    if(isShowOverrides){
                        index = draft.securityGroupData
                            .findIndex((sgd) => sgd.securityGroupGuid === securityGroupGuid && sgd.planOverride === planGuidOverride);
                    } else {
                        index = draft.securityGroupData.findIndex((sgd) => sgd.securityGroupGuid === securityGroupGuid);
                    }

                    if(index >= 0){
                        draft.securityGroupData[index] = securityDataGroup;
                    } else {
                        draft.securityGroupData.push(securityDataGroup);
                    }
                })}});
    };

    const updateAuthSecurityData = (authSecurityDataDetails: AuthSecurity[], authSecurity: AuthSecurityType ) => {
        dispatch({ type: EDIT_TAB_DATA,
            payload: { tabId,
                data: produce(data, (draft) => {
                    const fieldSecurityData = new AuthSecurityGroupData(ruleGuid,
                        entityType, securityGroupGuid, authSecurityDataDetails, planGuidOverride);
                    const index = data[authSecurity].findIndex((msd) => msd.securityGroupGuid === securityGroupGuid && msd.childPlanGuid === planGuidOverride);
                    index >= 0 ? draft[authSecurity][index] = fieldSecurityData : draft[authSecurity].push(fieldSecurityData)
                })}});
    }

    const produceNewSecurities = (currentState: AuthSecurityInterface, id: string, name: string, value: string) => {
        return produce(currentState, (draft) => {
            const i = draft[keyAuthSecurity].findIndex((e) => e.id === id);
            if (i >= 0) {
                draft[keyAuthSecurity][i] = { ...draft[keyAuthSecurity][i], securityLevelCode: value };
            } else {
                draft[keyAuthSecurity].push(new AuthSecurity(id, name, value));
            }
        });
    };

    const handleLevelCodeChange = (authSecurity: AuthSecurityType, id: string, name: string, value: string) => {
        let newAuthSecurities : AuthSecurityInterface;
        switch (authSecurity) {
            case 'maskSecurityData': {
                newAuthSecurities = produceNewSecurities(maskSecuritiesOptions as AuthSecurityInterface, id, name, value);
                dispatch({
                    type: EDIT_USER_DATA,
                    payload: {
                        tabId,
                        name: 'maskSecuritiesOptions',
                        value: newAuthSecurities
                    }
                });
                break;
            }
            default:
                newAuthSecurities = produceNewSecurities(fieldSecuritiesOptions as AuthSecurityInterface, id, name, value);
                dispatch({
                    type: EDIT_USER_DATA,
                    payload: {
                        tabId,
                        name: 'fieldSecuritiesOptions',
                        value: newAuthSecurities
                    }
                });
        }

        if(newAuthSecurities[keyAuthSecurity].length > 0) {
            updateAuthSecurityData(newAuthSecurities[keyAuthSecurity], authSecurity);
        }
    }

    const dispatchUpdateField = (field: 'securityGroupGuid' | 'planGuidOverride', value: string) => {
        if (data.oipaRule.override.overrideName === GLOBAL && field === 'securityGroupGuid') {
            dispatch({ type: EDIT_TAB_DATA,
                payload: { tabId,
                            data:  produce(data, (draft) => {
                                draft.securityGroupGuid = value;
                                draft.globalSelectedOverrideGuid = primaryCompanySelected;
                        })
                    } 
                }
            );
        }
        dispatch({
            type: EDIT_USER_DATA,
            payload: {
                tabId,
                 name: field,
                value,
            },
        })
    }

    const disableCompanyHasAccess = (hasAccess: boolean) => {
        return hasAccess || (readOnly || !securityGroupGuid || loading) ;
    }

    useEffect(() => {
        fetchSecurityGroupOptions();
        if(isShowOverrides){
            fetchAvailablePlans();
        }
    }, [isShowOverrides]);

    useEffect(() => {
        if(isShowAuthSecurities){
            fetchAuthSecurities(maskSecuritiesOptions, 'maskSecuritiesOptions', data.oipaRule.override.overrideName === GLOBAL ? securityService.getAuthMaskGlobal:securityService.getAuthMask);
            fetchAuthSecurities(fieldSecuritiesOptions,'fieldSecuritiesOptions', data.oipaRule.override.overrideName === GLOBAL ? securityService.getAuthFieldGlobal :securityService.getAuthField);
        }

        if(isShowCompanySecurity) {
            fetchCompanySecurity();
        }

        if(entityType === 'COMPANY' && primaryCompany){
            fetchAuthCompanyWebService();
        }
        setShowMessageRemoveAccess(false);
    }, [securityGroupGuid, isShowAuthSecurities, isShowCompanySecurity, status, planGuidOverride]);

    useEffect(() => {
        if(securityGroupGuid &&
            authCompanyWebServiceList[securityGroupGuid]) {
            const list : AuthCompanyWebService[] = authCompanyWebServiceList[securityGroupGuid];
            const webServiceDetails: {[key: string]: string} = list?.reduce(( acc: {[key: string]: string}, item) => {
                return {...acc, [item.webServiceName]: item.access}
            }, {});

            const grantAccessAll = Object.keys(webServiceDetails)
                ?.reduce((acc, key) => acc && webServiceDetails[key] === Access.Yes, true);

            dispatch({ type: EDIT_TAB_DATA,
                payload: { tabId,
                    data:  produce(data, (draft) => {
                        const index = draft.authCompanyWebServiceData.findIndex((c) => c.securityGroupGuid === securityGroupGuid);
                        if(index >= 0) {
                            if(grantAccessAll){
                                draft.authCompanyWebServiceData[index].grantAccessAll = Access.Yes;
                                draft.authCompanyWebServiceData[index].authCompanyWebServiceDetail = {};
                            } else {
                                draft.authCompanyWebServiceData[index].grantAccessAll = Access.No;
                                draft.authCompanyWebServiceData[index].authCompanyWebServiceDetail = webServiceDetails;
                            }
                        } else {
                            draft.authCompanyWebServiceData.push(new AuthCompanyWebServiceData(ruleGuid,
                                entityType, securityGroupGuid,
                                grantAccessAll ? {} : webServiceDetails,
                                grantAccessAll ? Access.Yes : Access.No));
                        }
                    }) } });
        }
    }, [authCompanyWebServiceList, securityGroupGuid]);

    useEffect(() => {
        if(reloadContent){
            if (data.oipaRule.override.overrideName === GLOBAL) {
                fetchPrimaryCompany();
                load(async () => {
                    await fetchSecurityGroupOptionsByCompanyGuid(primaryCompanySelected);
                })();
            }
            

            fetchSecurityGroupOptions();
            if(isShowOverrides){
                fetchAvailablePlans();
            }

            dispatch({ type: EDIT_TAB_DATA,
                payload: {
                    tabId,
                    data: produce(data, (draft) => {
                        draft.extras.reloadContent = false;
                    })
                }
            });
        }
    }, [ reloadContent ]);

    useEffect(() => {
        dispatch({ type: EDIT_TAB_DATA,
            payload: { tabId,
                       data:  produce(data, (draft) => {
                            draft.globalSelectedOverrideGuid = primaryCompanySelected;
                    })
                } 
            }
        );
        dispatchUpdateField ('securityGroupGuid' , '') ;
    }, [ primaryCompanySelected]);

    useEffect(() => {
        if (data.oipaRule.override.overrideName === GLOBAL) {
            fetchPrimaryCompany();
            dispatch({ type: EDIT_TAB_DATA,
                payload: { tabId,
                           data:  produce(data, (draft) => {
                                draft.globalSelectedOverrideGuid = '';
                                draft.securityGroupGuid = '';
                        })
                    } 
                }
            );
        }
    }, [ ]);

    const keyAuthSecurity = useMemo(() => `${securityGroupGuid}_${planGuidOverride}`,
        [securityGroupGuid, planGuidOverride]);

    const authMaskSecurities = useMemo(() => maskSecuritiesOptions[keyAuthSecurity] ?? [],
        [maskSecuritiesOptions, keyAuthSecurity]);

    const authFieldSecurities = useMemo(() => fieldSecuritiesOptions[keyAuthSecurity] ?? []
        , [fieldSecuritiesOptions, keyAuthSecurity]);

    const setCompany = (guid: string) => {
        setPrimaryCompanySelected(guid);
        dispatchUpdateField ('securityGroupGuid' , '') ;
        resetSecurityGroup();

            load(async () => {
                await fetchSecurityGroupOptionsByCompanyGuid(guid);
            })();
        
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />

            {header && <FileHeaderContainer>{header}</FileHeaderContainer>}
            {(data.oipaRule.ruleName === 'ClientScreen' || data.oipaRule.ruleName === 'AddressScreen') && data.oipaRule.override.overrideName === GLOBAL ? (
                <SecurityGroupListContent>
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                            <InputText
                                label='Primary Company'
                                type='select'
                                options={primaryCompanyList}
                                value={primaryCompanySelected}
                                defaultValue='Select one'
                                onChange={(e: Options) => setCompany(e.value)}
                                required
                            />
                    </Grid>
                        <Grid item sm={6}>
                             <InputText
                                label='Security Group'
                                type='select'
                                options={securityGroups}
                                value={securityGroupGuid}
                                onChange={(e: Options) => dispatchUpdateField('securityGroupGuid', e.value)}
                                disabled={primaryCompanySelected === ''}
                                required
                            />
                        </Grid>
                        
                </Grid>
            </SecurityGroupListContent>
            ) : (
                <>
                <SecurityGroupListContent>
                <Grid container spacing={2}>
                    <Grid item sm={ isShowOverrides ? 6 : 12 }>
                            <InputText
                                label='Security Group'
                                type='select'
                                options={securityGroups}
                                value={securityGroupGuid}
                                onChange={(e: Options) => dispatchUpdateField('securityGroupGuid', e.value)}
                                required
                            />
                    </Grid>
                    {isShowOverrides &&
                        <Grid item sm={6}>
                            <InputText
                                type='select'
                                label="Overrides"
                                options={availablePlansOptions}
                                value={planGuidOverride}
                                onChange={(e: Options) => dispatchUpdateField('planGuidOverride', e.value)}
                                disabled={entityType === 'PRODUCT'}
                            />
                        </Grid>
                    }
                </Grid>
            </SecurityGroupListContent>
                </>
            )}
            

            {entityType === 'COMPANY' &&
                <CompanyAccessContent>
                    <InputText
                        feedbackMsg={showMessageRemoveAccess ? "It's not possible to remove the access" : ""}
                        type='checkbox'
                        options={[{label: 'Company has access', value: 'hasAccess', disabled: disableCompanyHasAccess(companyHasAccess[securityGroupGuid])}]}
                        checkedValues={[companyHasAccess[securityGroupGuid] ? 'hasAccess' : '']}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleCompanySecurityChange(e.target.checked)}
                        disabled={disableCompanyHasAccess(companyHasAccess[securityGroupGuid])}
                    />
                </CompanyAccessContent>
            }

            { entityType === 'COMPANY' && primaryCompany &&
                <CollapseContainer title='Webservice Security'>
                   <AuthCompanyWebServiceSection
                       authCompanyWebServices={authCompanyWebServiceList[securityGroupGuid] ?? []}
                       isEditMode={!readOnly}
                       loading={loading}
                       handleAccessChange={updateAuthCompanyWebService} />
                </CollapseContainer>
            }
            {isShowEntityPageSecurity &&
                <CollapseContainer title={`${EntityTypePageSecurityEnum.getEnumFromCode(entityType).value} Page Security`}>
                    <CompanyPageSecuritySection
                        isEditMode={!readOnly}
                        entityGuid={ruleGuid}
                        securityGroupGuid={securityGroupGuid}
                        planGuidChosen={planGuidOverride}
                        overrideTypeCode={overrideTypeCode}
                        entityType={entityType as EntityTypeSecurityGroup}
                        dataFields={dataFields}
                        tabId={tabId}
                        updateSecurityGroupData={updateSecurityGroupData}
                        forceUpdate={forceUpdate}
                    />
                </CollapseContainer>}

            { isShowAuthSecurities &&
                <>
                    <CollapseContainer title='Masks Security'>
                        <AuthSecuritySection
                            authSecurities={authMaskSecurities}
                            isEditMode={!readOnly}
                            loading={loading}
                            authCodeLevelOptions={maskSecurityLevelCodesOptions}
                            handleLevelCodeChange={handleLevelCodeChange.bind(null, 'maskSecurityData')}
                        />
                    </CollapseContainer>

                    <CollapseContainer title='Fields Security'>
                        <AuthSecuritySection
                            authSecurities={authFieldSecurities}
                            isEditMode={!readOnly}
                            loading={loading}
                            authCodeLevelOptions={fieldSecurityLevelCodesOptions}
                            handleLevelCodeChange={handleLevelCodeChange.bind(null, 'fieldSecurityData')}
                        />
                    </CollapseContainer>
                </>
            }
        </WindowContainer>
    );
};

EntitySecurityData.defaultProps = {
    entityService: defaultEntitiesService,
    securityService: defaultSecurityGroupService,
    basicEntityService: defaultBasicEntityService,
};

export default EntitySecurityData;