import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import {ToggleSwitch} from '@equisoft/design-elements-react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../../components/general";
import {  PanelSectionContainer } from "../../../../components/general/sidebar/style";
import produce, {immerable} from 'immer';
import {useTabActions} from '../../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../../components/general/sidebar/rightbarContext';
import {defaultBasicEntityService, defaultEntitiesService, defaultEntityInformationService} from '../../../../lib/context';
import BasicEntity from '../../../../lib/domain/entities/basicEntity';
import CreateChartAccountEntryRequest from '../../../../lib/domain/entities/createChartAccountEntryRequest';
import BasicEntityService from '../../../../lib/services/basicEntityService';
import EntityService from '../../../../lib/services/entitiesService';
import EntityInformationService from '../../../../lib/services/entityInformationService';
import {ToggleSwitchContainer, ToggleSwitchContent} from './styles';
import FrameworkComponent from "../../frameworkComponent";
import {validateRequiredFields} from "../../util";

const DEBIT_CODE = 'AsCodeDebitCredit';
const ACCOUNTING_TYPE_CODE = 'AsCodeAccountingType';
const FUND_TYPE_CODE = 'AsCodeFundType';

const typeFieldsString = ['entryDescription', 'chartOfAccountsEntityGuid', 'debitCreditCode', 'accountingTypeCode', 'fundTypeCode'] as const;
type TypeFieldsString = typeof typeFieldsString[number];
const isTypeFieldString = (field: any) : field is TypeFieldsString => typeFieldsString.includes(field);

const typeFieldsDate = ['effectiveFromDate', 'effectiveToDate'] as const;
type TypeFieldsDate = typeof typeFieldsDate[number];
const isTypeFieldDate = (field: any) : field is TypeFieldsString => typeFieldsDate.includes(field);

const requiredFields = ['entryDescription', 'chartAccount', 'chartOfAccountsEntityGuid', 'debitCreditCode', 'accountingTypeCode'] as const;
type TypeRequiredFields = typeof requiredFields[number];
const isRequiredField = (field: any) : field is TypeRequiredFields => requiredFields.includes(field);

class ErrorEntry {
    [immerable] = true;
    entryDescription = '';
    chartAccount = '';
    chartOfAccountsEntityGuid = '';
    debitCreditCode = '';
    accountingTypeCode = '';
}

interface EntryCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    basicEntityService: BasicEntityService;
}

const EntryAccountCreationWizard = ({entityService, entityInformationService}: EntryCreationProps) => {
    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const [entities, setEntities] = useState<BasicEntity[]>([]);
    const [chartAccounts, setChartAccounts] = useState<BasicEntity[]>([]);
    const [chartAccount, setChartAccount] = useState('');
    const {closeRightbar} = useContext(RightbarContext);
    const [request, setRequest] = useState<CreateChartAccountEntryRequest>(new CreateChartAccountEntryRequest());
    const [debitCreditCodes, setDebitCreditCodes] = useState<BasicEntity[]>([]);
    const [accountingTypeCodes, setAccountingTypeCodes] = useState<BasicEntity[]>([]);
    const [fundTypeCodes, setFundTypeCodes] = useState<BasicEntity[]>([]);
    const [error, setError] = useState(new ErrorEntry());

    const optionsChartAccount = useMemo(() => [
        { label: 'Select One', value: ''},
        ...Object.values(chartAccounts).map((f) => ({
            label: f.name,
            value: f.value
        }))
    ], [chartAccounts]);


    const optionsEntities = useMemo(() =>
        [{ label: 'Select One', value: ''},
         ...Object.values(entities).map((f) => ({
        label: f.name,
        value: f.value
    }))], [entities]);

    const optionsDebitCreditCode = useMemo(() => [
        { label: debitCreditCodes.length > 0 ? 'Select Debit Code' : ' No Debit Code Available', value: ''},
        ...Object.values(debitCreditCodes).map((f) => ({
            label: f.name,
            value: f.value
        }))
    ], [debitCreditCodes]);

    const optionsAccountTypeCode = useMemo(() => [
        { label: accountingTypeCodes.length > 0 ? 'Select Accounting Code' : ' No Accounting Code Available', value: ''},
        ...Object.values(accountingTypeCodes).map((f) => ({
            label: f.name,
            value: f.value
        }))
    ], [accountingTypeCodes]);

    const optionsFundTypeCode = useMemo(() => [
        {label: fundTypeCodes.length > 0 ? 'Select Fund Code' : ' No Fund Code Available', value: ''},
        ...Object.values(fundTypeCodes).map((f) => ({
            label: f.name,
            value: f.value
        }))
    ], [fundTypeCodes]);

    const fetchData = load(() => {
        entityService.getChartAccounts().then(setChartAccounts);
        entityService.getCodes(DEBIT_CODE).then(setDebitCreditCodes);
        entityService.getCodes(FUND_TYPE_CODE).then(setFundTypeCodes);
        entityService.getCodes(ACCOUNTING_TYPE_CODE).then(setAccountingTypeCodes);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(error, {...request, chartAccount });
        setError(newError);
        return isValid;
    }

    const createEntry = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const entry = await entityService.createChartAccountEntry(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            entry.entityType,
            entry.getGuid(),
            'DATA'
        );
        dispatch({type: OPEN, payload: {data: entityInformation}});
        closeRightbar();
    });



    const handleFieldChanged = async (field: TypeFieldsString | TypeFieldsDate | 'chartAccount' , value: string | Date) => {
        if(isRequiredField(field)) {
            setError(produce(error, (draft => {
                draft[field] = '';
            })));
        }

        if(isTypeFieldString(field)) {
            setRequest(
                produce(request, (draft) => {
                    draft[field] = value as string;
                })
            );
            return;
        }

        if(isTypeFieldDate(field)) {
            setRequest(
                produce(request, (draft) => {
                    draft[field as TypeFieldsDate] = value as Date;
                })
            );
            return;
        }

        setChartAccount(value as string);
        const result = await entityService.getChartAccountEntities(value as string);
        setEntities(result);
    };


    const handleSwitchChange = (field: keyof CreateChartAccountEntryRequest, value: boolean) => {
        setRequest(
            produce(request, (draft) => {
                (draft[field] as boolean) = value;
            }));
    };

    return (
        <FrameworkComponent
            title='Create Chart of Account Entry'
            loading={loading}
            onSubmit={createEntry}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.entryDescription}
                        label="Entry Description"
                        required
                        feedbackMsg={error.entryDescription}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('entryDescription',e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={chartAccount}
                        label="Chart Of Accounts"
                        options={optionsChartAccount}
                        onChange={(o : Options) => handleFieldChanged('chartAccount', o.value)}
                        required
                        feedbackMsg={error.chartAccount}
                    />

                    <InputText
                        type='custom-select'
                        value={request.chartOfAccountsEntityGuid}
                        label="Chart Of Accounts Entity"
                        options={optionsEntities}
                        onChange={(o: Options) => handleFieldChanged('chartOfAccountsEntityGuid', o.value)}
                        required
                        feedbackMsg={error.chartOfAccountsEntityGuid}
                    />

                    <InputText
                        type='custom-select'
                        value={request.debitCreditCode}
                        label="Debit Credit Code"
                        options={optionsDebitCreditCode}
                        onChange={(o : Options) => handleFieldChanged('debitCreditCode', o.value)}
                        required
                        feedbackMsg={error.debitCreditCode}
                    />

                    <InputText
                        type='custom-select'
                        value={request.accountingTypeCode}
                        label="Accounting Type Code"
                        options={optionsAccountTypeCode}
                        onChange={(o: Options) => handleFieldChanged('accountingTypeCode', o.value)}
                        required
                        feedbackMsg={error.accountingTypeCode}
                    />

                    <InputText
                        type='custom-select'
                        value={request.fundTypeCode}
                        label="Fund Type Code"
                        options={optionsFundTypeCode}
                        onChange={(o: Options) => handleFieldChanged('fundTypeCode', o.value)}
                    />

                    <InputText
                        type='date'
                        label="Effective From"
                        value={request.effectiveFromDate}
                        startDate={request.effectiveFromDate}
                        onChange={(d: Date) => handleFieldChanged('effectiveFromDate', d)}
                    />

                    <InputText
                        type='date'
                        label="Effective To"
                        value={request.effectiveToDate}
                        startDate={request.effectiveToDate}
                        onChange={(d: Date) => handleFieldChanged('effectiveToDate', d)}
                    />

                    <ToggleSwitchContainer>
                    <ToggleSwitchContent>
                        <ToggleSwitch
                            label="Flip On Negative"
                            toggled={request.flipOnNegativeFlag}
                            onToggle={(value: boolean) => handleSwitchChange('flipOnNegativeFlag', value)}
                        />
                    </ToggleSwitchContent>

                    <ToggleSwitchContent>
                        <ToggleSwitch
                            label="Gain/Loss"
                            toggled={request.gainLossFlag}
                            onToggle={(value: boolean) => handleSwitchChange('gainLossFlag', value)}
                        />
                    </ToggleSwitchContent>

                    <ToggleSwitchContent>
                        <ToggleSwitch
                            label="Do Reversal Accounting"
                            toggled={request.doReversalAccountingFlag}
                            onToggle={(value: boolean) => handleSwitchChange('doReversalAccountingFlag', value)}
                        />
                    </ToggleSwitchContent>

                    <ToggleSwitchContent>
                        <ToggleSwitch
                            label="Link Suspense"
                            toggled={request.linkSuspenseFlag}
                            onToggle={(value: boolean) => handleSwitchChange('linkSuspenseFlag', value)}
                        />
                    </ToggleSwitchContent>
                    </ToggleSwitchContainer>
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

EntryAccountCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    basicEntityService: defaultBasicEntityService
};
export default EntryAccountCreationWizard;