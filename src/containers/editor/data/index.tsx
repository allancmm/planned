import React, { ChangeEvent, ReactElement, useMemo } from 'react';
import {
    TextInput,
    Select,
    WindowContainer,
    CollapseContainer,
    TextAreaInput,
    DateInput,
} from 'equisoft-design-ui-elements';
import InputText from "../../../components/general/inputText";
import produce from 'immer';
import { toast } from 'react-toastify';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_DATA_FIELDS, EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import EntityField from '../../../lib/domain/entities/entityField';
import FundField from '../../../lib/domain/entities/fundField';
import GenericRuleField from '../../../lib/domain/entities/genericRuleField';
import PlanFundStatus from '../../../lib/domain/entities/planFundStatus';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import Translation from '../../../lib/domain/entities/translation';
import EntityFieldsSection from './entityFieldsSection';
import FundFieldsSection from './fundFieldsSection';
import PlanFundStatusSection from './planFundStatusSection';
import TranslationSection from './translationSection';
import { Grid, GridSize, Divider } from "@material-ui/core";
import {TextAreaContent, DataFieldsContainer, MoneyTypeContainer, MoneyTypeListCustom} from './style';
import CriteriaSection from './criteriaSection';
import ChartOfAccountsCriteriaDto from '../../../lib/domain/entities/chartOfAccountsCriteria';
import ResultSection from './resultSectionProps';
import ChartOfAccountsResultDto from '../../../lib/domain/entities/chartOfAccountsResult';
import { dateToString } from "../../../lib/util/date";
import ChartOfAccountsMoneyType from "../../../lib/domain/entities/chartOfAccountsMoneyType";
import ListItems from "../../../components/general/listItems";

const NUMBER_COLUMNS_GRID = 12;

const DATA_FIELD_FALSE = '0';
const DATA_FIELD_TRUE = '1';
const TOTAL_FUNDS = '01';
const BY_FUND_TYPE_CODE = '02';
const MATH_VARIABLE_TYPE_CODE = '03';
// const SUSPENSE_AMOUNT_TYPE_CODE = '04';
const DISBURSEMENT_TYPE_CODE = '05';
const SUSPENSE_FIELD_AMOUNT_TYPE_CODE = '06';

const NEW_DATE = new Date();

const RESET_FIELDS_ACCOUNTING =
    ['AccountingAmountField',
     'FundTypeCode',
     'OriginalDisbursementStatusCode',
     'GainLossFlag',
     'FlipOnNegativeFlag',
     'DoReversalAccountingFlag',
     'LINKSUSPENSEFLAG'];

const RESET_FIELDS_DISBURSEMENT =
    ['AccountingAmountField',
        'FundTypeCode',
        'OriginalDisbursementStatusCode',
        'GainLossFlag',
        'FlipOnNegativeFlag',
        'DoReversalAccountingFlag',
        'LINKSUSPENSEFLAG'];

const CHART_OF_ACCOUNTS_ENTRY = 'CHART_OF_ACCOUNTS_ENTRY';

const hasOptionsList = (f: GenericRuleField): boolean => f.optionsList?.length !== 0;

const camelize = (str: string): string =>
     str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g,
         (match, index): string => {
                    if (+match === 0) return "";
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                }
    );

// TODO - Allan - create an interface
const LABELS_CHART_ACC_ENT: any = {
    AccountNumberFormat: 'Account Number Format',
    AccountingAmountField: 'Account Amount',
    AccountingTypeCode: 'Accounting Type',
    ChartOfAccountsEntryGUID: 'chartOfAccountsEntryGUID',
    DebitCreditCode: 'Debit/Credit',
    DoReversalAccountingFlag: 'Do Reversal Accounting',
    EffectiveFromDate: 'Effective From Date',
    EffectiveToDate: 'Effective To Date',
    EntryDescription: 'Entry Description',
    FlipOnNegativeFlag: 'Flip On Negative',
    FundTypeCode: 'Fund Type',
    GainLossFlag: 'Gain/Loss',
    LINKSUSPENSEFLAG: 'Link Suspense',
    OriginalDisbursementStatusCode: 'Original Disbursement Status',
} as const;


class ChartOfAccountEntryField extends GenericRuleField {
    label: string = '';
    constructor(genericField?: GenericRuleField) {
        super(genericField?.name, genericField?.value, genericField?.type, genericField?.disabled, genericField?.optionsList);
        this.label = LABELS_CHART_ACC_ENT[genericField?.name ?? ''] ?? '';
    }
}

class ChartAccountsEntryField {
    accountNumberFormat = new ChartOfAccountEntryField();
    accountingAmountField = new ChartOfAccountEntryField();
    accountingTypeCode = new ChartOfAccountEntryField();
    chartOfAccountsEntryGUID = new ChartOfAccountEntryField();
    debitCreditCode = new ChartOfAccountEntryField();
    doReversalAccountingFlag = new ChartOfAccountEntryField();
    effectiveFromDate = new ChartOfAccountEntryField();
    effectiveToDate = new ChartOfAccountEntryField();
    entryDescription = new ChartOfAccountEntryField();
    flipOnNegativeFlag = new ChartOfAccountEntryField();
    fundTypeCode = new ChartOfAccountEntryField();
    gainLossFlag = new ChartOfAccountEntryField();
    linkSuspenseFlag = new ChartOfAccountEntryField();
    originalDisbursementStatusCode = new ChartOfAccountEntryField();
}

const buildChartAccountEntryFields = (dataFields: GenericRuleField[]) : ChartAccountsEntryField =>
   dataFields.reduce((acc, current) =>
       ({
         ...acc,
         [current.name !== 'LINKSUSPENSEFLAG' ? camelize(current.name) : 'linkSuspenseFlag']: new ChartOfAccountEntryField(current)
       }
   ),  new ChartAccountsEntryField() );

interface EntityDataProps {
    tabId: string;
    header?: React.ReactNode;
}

export const EntityData = ({ tabId, header }: EntityDataProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);

    const { data } = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { moneyTypeCodes, chartOfAccountsMoneyTypes } = data;

    const selectedMoneyTypes = useMemo(() =>
         chartOfAccountsMoneyTypes.map(c =>
             moneyTypeCodes.find(m => m.value === c.moneyTypeCode)?.value ?? ''
         )
        , [chartOfAccountsMoneyTypes]);

    const chartAccountEntryFields: ChartAccountsEntryField = buildChartAccountEntryFields(data.dataFields);

    const isFieldDisabled = (f: GenericRuleField): boolean =>  data.status.readOnly || f.disabled;

    const handleOnChangeMoneyType = (moneyTypeSelected: string) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    const index = chartOfAccountsMoneyTypes.findIndex(c => c.moneyTypeCode === moneyTypeSelected);
                    if(index > -1){
                        draft.chartOfAccountsMoneyTypes.splice(index, 1);
                    } else {
                        draft.chartOfAccountsMoneyTypes.push(new ChartOfAccountsMoneyType(moneyTypeSelected, data.getGuid()));
                    }
                })
            }
        });
    }

    const changeFieldValue = (name: string, value: string) => {
        dispatch({ type: EDIT_DATA_FIELDS, payload: { id: tab.id, name, value } });
    };

    const changeFieldChartAccEntry = (name: string, value: string) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    const index = data.dataFields.findIndex((f) => f.name === name);
                    draft.dataFields[index].value = value;

                    if(name === 'AccountingTypeCode') {
                        if(value === DISBURSEMENT_TYPE_CODE){
                            RESET_FIELDS_DISBURSEMENT.forEach((fieldReset) => {
                                const indexReset = data.dataFields.findIndex((f) => f.name === fieldReset);
                                draft.dataFields[indexReset].value = draft.dataFields[indexReset].type === 'CHECK' ? DATA_FIELD_FALSE : '';
                            });
                            const indexAccountingAmount = data.dataFields.findIndex((f) => f.name === 'AccountingAmountField');
                            draft.dataFields[indexAccountingAmount].value = 'DisbursementAmount';
                        } else {
                            RESET_FIELDS_ACCOUNTING.forEach((fieldReset) => {
                                const indexReset = data.dataFields.findIndex((f) => f.name === fieldReset);
                                draft.dataFields[indexReset].value = draft.dataFields[indexReset].type === 'CHECK' ? DATA_FIELD_FALSE : '';
                            });
                        }
                        return;
                    }

                    if(name === 'FlipOnNegativeFlag' && value === DATA_FIELD_TRUE){
                        const indexGainLoss = data.dataFields.findIndex((f) => f.name === 'GainLossFlag');
                        draft.dataFields[indexGainLoss].value = DATA_FIELD_FALSE;
                        return;
                    }

                    if(name === 'GainLossFlag' && value === DATA_FIELD_TRUE){
                        const indexFlipNeg = data.dataFields.findIndex((f) => f.name === 'FlipOnNegativeFlag');
                        draft.dataFields[indexFlipNeg].value = DATA_FIELD_FALSE;
                        return;
                    }
                }),
            },
        });
    };

    const changeTranslationValue = (newTrans: Translation[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.translations = newTrans;
                }),
            },
        });
    };

    const updatePlanFundStatus = (newPlanFundStatus: PlanFundStatus[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.planFundStatus = newPlanFundStatus;
                }),
            },
        });
    };

    const updateCriterias = (newCriterie: ChartOfAccountsCriteriaDto[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.chartOfAccountsCriterias = newCriterie;
                }),
            },
        });
    };

    const updateResults = (newResults: ChartOfAccountsResultDto[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.chartOfAccountsResults = newResults;
                }),
            },
        });
    };

    const updateFundFields = (newFundFields: FundField[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.fundFields = newFundFields;
                }),
            },
        });
    }

    const updateChildFundFields = (newFundFields: FundField[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.childFundFields = newFundFields;
                }),
            },
        });
    }

    const updateBenefitFundFields = (newFundFields: FundField[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.benefitFundFields = newFundFields;
                }),
            },
        });
    }

    const updateLateralFundFields = (newFundFields: FundField[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.lateralFundFields = newFundFields;
                }),
            },
        });
    }

    const isEntityTypeFund = ['FUND', 'CHILD_FUNDS', 'BENEFIT_FUNDS', 'LATERAL_FUNDS'].includes(data.entityType);

    const updateEntityFields = (newEntityFields: EntityField[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.entityFields = newEntityFields;
                }),
            },
        });
    }

    const fieldsTitle = (data.entityType === 'PLAN') ? 'Plan Fields' :
        (data.entityType === 'COMPANY') ? 'Company Fields' : '';

    const rowData = (label: string, element: ReactElement, columnsLabel?: GridSize) =>
        <Grid container spacing={2} >
            <Grid item sm={columnsLabel ? columnsLabel : 2}>
                <label>{label}</label>
            </Grid>
            <Grid item sm={columnsLabel ? NUMBER_COLUMNS_GRID - (columnsLabel as number) as GridSize : 10}>
                {element}
            </Grid>
        </Grid>

    const selectDataField = (field: GenericRuleField) => {
        if (hasOptionsList(field)) {
            return rowData(`${field.name}:`,
                <Select
                    options={field.optionsList?.map((c) => ({ label: c.name, value: c.value })) ?? []}
                    onChange={(e) => changeFieldValue(field.name, e.target.value)}
                    disabled={isFieldDisabled(field)}
                    value={field.value}
                    validationErrorMessage='Please select an option'
                    required
                />)
        }

        if (field.name === 'TemplateText') {
            return rowData(`${field.name}:`,
                <TextAreaContent>
                    <TextAreaInput
                        value={field.value || ''}
                        disabled={isFieldDisabled(field)}
                        onChange={(e: any) => changeFieldValue(field.name, e.target.value)}
                        rows={field.value.split(/\r\n|\r|\n/).length + 1}
                    />
                </TextAreaContent>)
        }

        return rowData(`${field.name}:`,
            <TextInput
                value={field.value || ''}
                disabled={isFieldDisabled(field)}
                onChange={(e) => changeFieldValue(field.name, e.target.value)}
            />)
    }

    const inputChartAccEntry = (field: ChartOfAccountEntryField, disabled?: boolean) => {
        if (hasOptionsList(field)) {
            return rowData(`${field.label}:`,
                <Select
                    options={field.optionsList?.map((c) => ({ label: c.name, value: c.value })) ?? []}
                    onChange={(e) => changeFieldChartAccEntry(field.name, e.target.value)}
                    value={field.value}
                    validationErrorMessage='Please select an option'
                    required = {field.name !== 'FundTypeCode'}
                    disabled={disabled}
                    emptySelectText={field.name === 'FundTypeCode' ? 'None': 'Select one'}
                />,
                4)
        }

        if(field.type === 'DATE') {
            return rowData(`${field.label}:`,
                <DateInput
                    selected={ field.value ? new Date(field.value) : null }
                    disabled={disabled}
                    onChange={(d: Date) => {
                        d && d.setHours(NEW_DATE.getHours(), NEW_DATE.getMinutes(), NEW_DATE.getSeconds());
                        changeFieldChartAccEntry(field.name, dateToString(d, 'yyyy-MM-dd HH:mm:ss.SSS'))
                       }
                    }
                />,
                4
            );
        }

        if(field.type === 'CHECK') {
            return rowData(`${field.label}:`,
                <div style={{ minHeight: '32px' }}>
                    <InputText
                        type='checkbox'
                        options={[{ value: field.name, label: '', disabled }]}
                        checkedValues={[ field.value === DATA_FIELD_TRUE ? field.name : '' ]}
                        onChange={(v: ChangeEvent<HTMLInputElement>) => changeFieldChartAccEntry(field.name, v.target.checked ? DATA_FIELD_TRUE : DATA_FIELD_FALSE)}

                    />
                </div>,
                 4
            )
        }

        return rowData(`${field.label}:`,
            <TextInput
                value={field.value || ''}
                disabled={disabled}
                onChange={(e) => changeFieldChartAccEntry(field.name, e.target.value)}
            />, 4)
    }

    const dataFieldsChartOfAccountEntry = () =>       
            <Grid container spacing={2} alignContent='center' justifyContent='center'  alignItems='center'>
                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.effectiveFromDate,
                                        isFieldDisabled(chartAccountEntryFields.effectiveFromDate))}
                </Grid>
                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.effectiveToDate,
                                       isFieldDisabled(chartAccountEntryFields.effectiveToDate))}
                </Grid>

                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.accountNumberFormat,
                                       isFieldDisabled(chartAccountEntryFields.accountNumberFormat))}
                </Grid>

                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.debitCreditCode,
                                        isFieldDisabled(chartAccountEntryFields.debitCreditCode))}
                </Grid>

                <Grid item sm={12}>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                           {inputChartAccEntry(chartAccountEntryFields.entryDescription,
                                              isFieldDisabled(chartAccountEntryFields.entryDescription))}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={12}>
                    <Divider/>
                </Grid>

                <Grid item sm={12}>
                   <Grid container spacing={2}>
                       <Grid item sm={6}>
                           {inputChartAccEntry(chartAccountEntryFields.accountingTypeCode,
                                               isFieldDisabled(chartAccountEntryFields.accountingTypeCode))}
                       </Grid>
                   </Grid>
                </Grid>

                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.accountingAmountField,
                        isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                        (chartAccountEntryFields.accountingTypeCode.value !== MATH_VARIABLE_TYPE_CODE &&
                                chartAccountEntryFields.accountingTypeCode.value !== SUSPENSE_FIELD_AMOUNT_TYPE_CODE)
                    )}
                </Grid>

                <Grid item sm={6}>
                    {inputChartAccEntry(chartAccountEntryFields.fundTypeCode,
                        isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                        (chartAccountEntryFields.accountingTypeCode.value !== BY_FUND_TYPE_CODE &&
                                chartAccountEntryFields.accountingTypeCode.value !== MATH_VARIABLE_TYPE_CODE &&
                                chartAccountEntryFields.accountingTypeCode.value !== TOTAL_FUNDS)
                     )}
                </Grid>

                <Grid item sm={12}>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            {inputChartAccEntry(chartAccountEntryFields.originalDisbursementStatusCode,
                                isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                                        chartAccountEntryFields.accountingTypeCode.value !== DISBURSEMENT_TYPE_CODE)}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={12}>
                    <Grid item sm={6}>
                        <Grid container spacing={2} style={{ minHeight: '48px' }}>
                            <Grid item sm={4}>
                                <label>{`${chartAccountEntryFields.flipOnNegativeFlag.label}:`}</label>
                            </Grid>
                            <Grid item sm={8}>
                                <Grid container>
                                    <Grid item sm={4}>
                                        <InputText
                                            type='checkbox'
                                            options={[{ value: chartAccountEntryFields.flipOnNegativeFlag.name,
                                                        label: '',
                                                        disabled: isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                                                                  (chartAccountEntryFields.accountingTypeCode.value !== BY_FUND_TYPE_CODE &&
                                                                  chartAccountEntryFields.accountingTypeCode.value !== MATH_VARIABLE_TYPE_CODE &&
                                                                  chartAccountEntryFields.accountingTypeCode.value !== TOTAL_FUNDS)
                                                     }]}
                                            checkedValues={[ chartAccountEntryFields.flipOnNegativeFlag.value === DATA_FIELD_TRUE ?
                                                             chartAccountEntryFields.flipOnNegativeFlag.name : '' ]}
                                            onChange={(v: ChangeEvent<HTMLInputElement>) =>
                                                changeFieldChartAccEntry(chartAccountEntryFields.flipOnNegativeFlag.name, v.target.checked ? DATA_FIELD_TRUE : DATA_FIELD_FALSE)
                                            }
                                        />
                                    </Grid>
                                    <Grid item sm={8}>
                                        <Grid container>
                                            <Grid item sm={6}>
                                                <label>{`${chartAccountEntryFields.gainLossFlag.label}:`}</label>
                                            </Grid>
                                            <Grid item sm={6}>
                                                <InputText
                                                    type='checkbox'
                                                    options={[{ value: chartAccountEntryFields.gainLossFlag.name,
                                                                label: '',
                                                                disabled: isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                                                                         (chartAccountEntryFields.accountingTypeCode.value !== BY_FUND_TYPE_CODE &&
                                                                          chartAccountEntryFields.accountingTypeCode.value !== TOTAL_FUNDS)
                                                             }]}
                                                    checkedValues={[ chartAccountEntryFields.gainLossFlag.value === DATA_FIELD_TRUE ?
                                                                     chartAccountEntryFields.gainLossFlag.name : '' ]}
                                                    onChange={(v: ChangeEvent<HTMLInputElement>) =>
                                                        changeFieldChartAccEntry(chartAccountEntryFields.gainLossFlag.name, v.target.checked ? DATA_FIELD_TRUE : DATA_FIELD_FALSE)
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={12}>
                    <Grid item sm={6}>
                        {inputChartAccEntry(chartAccountEntryFields.doReversalAccountingFlag,
                            isFieldDisabled(chartAccountEntryFields.accountingTypeCode) ||
                                    chartAccountEntryFields.accountingTypeCode.value !== DISBURSEMENT_TYPE_CODE)}
                    </Grid>
                </Grid>

                <Grid item sm={12}>
                    <Grid item sm={6}>
                        {inputChartAccEntry(chartAccountEntryFields.linkSuspenseFlag,
                                           isFieldDisabled(chartAccountEntryFields.linkSuspenseFlag))}
                    </Grid>
                </Grid>
            </Grid>        

    return (
        <WindowContainer>
            {header && <FileHeaderContainer>{header}</FileHeaderContainer>}

            <CollapseContainer title={'General'} defaultOpened>
                <DataFieldsContainer>
                    {data.entityType === CHART_OF_ACCOUNTS_ENTRY ?
                        <>
                            {dataFieldsChartOfAccountEntry()}
                            <Grid container spacing={2} style={{ marginTop: '12px' }}>
                                <Grid item sm={2}>
                                    <label>Transaction Money Types:</label>
                                </Grid>
                                <Grid item sm={4} style={{ marginTop: '-20px' }}>
                                    <MoneyTypeContainer>
                                         <MoneyTypeListCustom>
                                            <ListItems
                                                options={moneyTypeCodes.map((rule) =>
                                                    ({ value: rule.value, label: rule.name}))}
                                                onClick={handleOnChangeMoneyType}
                                                selectedItems={selectedMoneyTypes}
                                                className='list-container'
                                                disabled={data.status.readOnly}
                                            />
                                        </MoneyTypeListCustom>
                                    </MoneyTypeContainer>
                                </Grid>
                            </Grid>
                        </>
                        :
                        data.dataFields.map((field) => (
                            <span key={field.name}>
                                {selectDataField(field)}
                            </span>
                        ))}
                </DataFieldsContainer>
            </CollapseContainer>

            {data.entityType === 'TRANSACTIONS' &&
                <CollapseContainer title='Translations'>
                    <TranslationSection
                        translations={data.translations}
                        isEditMode={!data.status.readOnly}
                        updateTranslation={changeTranslationValue}
                    />
                </CollapseContainer>}

            {data.entityType === CHART_OF_ACCOUNTS_ENTRY &&
                <>
                    <CollapseContainer title='Criteria' defaultOpened>
                        <CriteriaSection
                            criterias={data.chartOfAccountsCriterias}
                            isEditMode={!data.status.readOnly}
                            updateCriterias={updateCriterias}
                        />
                    </CollapseContainer>

                    <CollapseContainer title='Results' defaultOpened>
                        <ResultSection
                            results={data.chartOfAccountsResults}
                            isEditMode={!data.status.readOnly}
                            ruleGuid={data.oipaRule.ruleGuid}
                            updateResults={updateResults}
                        />
                    </CollapseContainer>
                </>
            }

            {data.entityType === 'PLANFUND' && (
                <>
                    <CollapseContainer title={'Planfund Status'} defaultOpened>
                        <PlanFundStatusSection
                            planFundGuid={data.getGuid()}
                            planFundStatus={data.planFundStatus}
                            isEditMode={!data.status.readOnly}
                            updatePlanFundStatus={updatePlanFundStatus}
                        />
                    </CollapseContainer>
                </>
            )}
            {isEntityTypeFund && (
                <>
                    <CollapseContainer title={'Fund Fields'} defaultOpened>
                        <FundFieldsSection
                            fundFields={data.fundFields}
                            isEditMode={!data.status.readOnly}
                            updateFundFields={updateFundFields}
                        />
                    </CollapseContainer>
                    {(data.entityType === 'LATERAL_FUNDS') && (
                        <CollapseContainer title={'Lateral Fund Fields'} defaultOpened>
                            <FundFieldsSection
                                fundFields={data.lateralFundFields}
                                isEditMode={!data.status.readOnly}
                                updateFundFields={updateLateralFundFields}
                            />
                        </CollapseContainer>
                    )}
                    {(data.entityType === 'CHILD_FUNDS' || data.entityType === 'BENEFIT_FUNDS') && (
                        <CollapseContainer title={'Child Fund Fields'} defaultOpened>
                            <FundFieldsSection
                                fundFields={data.childFundFields}
                                isEditMode={!data.status.readOnly}
                                updateFundFields={updateChildFundFields}
                            />
                        </CollapseContainer>
                    )}
                    {data.entityType === 'BENEFIT_FUNDS' && (
                        <CollapseContainer title={'Benefit Fund Fields'} defaultOpened>
                            <FundFieldsSection
                                fundFields={data.benefitFundFields}
                                isEditMode={!data.status.readOnly}
                                updateFundFields={updateBenefitFundFields}
                            />
                        </CollapseContainer>
                    )}
                </>
            )}
            {(data.entityType === 'PLAN' || data.entityType === 'COMPANY') && (
                <>
                    <CollapseContainer title={fieldsTitle} defaultOpened>
                        <EntityFieldsSection
                            entityFields={data.entityFields}
                            isEditMode={!data.status.readOnly}
                            updateEntityFields={updateEntityFields}
                        />
                    </CollapseContainer>
                </>
            )}
        </WindowContainer>
    );
};
EntityData.defaultProps = {}

export default EntityData;