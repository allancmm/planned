import React, {useEffect, useState} from 'react';
import { Loading, useLoading, LoadMethod } from 'equisoft-design-ui-elements';
import {InputText, Options} from "../../../components/general";
import { defaultBasicEntityService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import OverrideSelector from '../../../lib/domain/entities/overrideSelector';
import BasicEntityService from '../../../lib/services/basicEntityService';
import { fetchData, getOverrideElements } from './generalTools';
import { getEnumKey, OverrideEnumType } from './overrideEnum';
import StateGeneralProps from './stateGeneralProps';
import { WarningMessage } from './style';
import SubComponent from './subComponent';
import produce, { Draft } from 'immer';
import { MSG_REQUIRED_FIELD } from "../../../lib/constants";

const CUSTOM_CODES = 3;
const GLOBAL_CODE = '00';

class DropdownOverride {
    code = '';
    title = '';
    value = '';
}
interface GeneralComponentProps {
    data: OverrideSelector;
    parentType?: string;
    filteredOverrides?: BasicEntity[];
    basicEntityService: BasicEntityService;
    warningMessage?: string;
    showGeneralComponent?: boolean;
    showMessageOverride?: boolean;
    load?: LoadMethod;
    setGeneralComponentState?(state: StateGeneralProps): void;
    setOverridesList?(state: BasicEntity[]): void;
    setOverrideLevelCode?(state: string): void;
    setOverride?(overrideGuid: string, overrideLevel: string): void;
    setIsOverrideValid?(value: boolean) : void;
}

interface StateGuidPairs {
    pCompany: BasicEntity[];
    sCompany: BasicEntity[];
    product: BasicEntity[];
    plan: BasicEntity[];
    transaction: BasicEntity[];
    fund: BasicEntity[];
    requirement: BasicEntity[];
}

const GeneralComponent = ({
    data,
    parentType = '',
    filteredOverrides,
    basicEntityService,
    warningMessage = `There is only one override level`,
    showMessageOverride = false,
    showGeneralComponent = true,
    setGeneralComponentState,
    setOverridesList,
    setOverrideLevelCode,
    setOverride,
    load: externalLoad,
    setIsOverrideValid,
}: GeneralComponentProps) => {

    const [typeDropDowns, setTypeDropDowns] = useState<DropdownOverride[]>();
    const [overrideLevel, setOverrideLevel] = useState<string>('');
    const [guidPcompany, setGuidPCompany] = useState<string>('');
    const [valueSubComponent, setValueSubComponent] = useState('');
    const [loading, internalLoad] = useLoading();

    // TODO - Allan - delete as soon all entityCreation components pass function load as parameter
    const load = externalLoad ?? internalLoad;

    const [optionGuidPairs, setOptionGuidPairs] = useState<StateGuidPairs>({
        pCompany: [],
        sCompany: [],
        product: [],
        plan: [],
        transaction: [],
        fund: [],
        requirement: [],
    });

    const [listOverride, setListOverride] = useState<{ code: string, guid: string, level: string  }[]>([]);

    let overrideLevelList: BasicEntity[] = [];

    useEffect(() => {
        reset();
        setTypeDropDowns([]);
        setOverrideLevel(``);
        setOverridesList?.(filteredOverrides ?? initOverrideList());
        initFirstElement();
        loadRequirementGlobal();
    }, []);

    const initFirstElement = () => {
        if (!filteredOverrides || filteredOverrides.length === 0) return;

        const overrideCode = filteredOverrides[0].value;
        setOverrideLevelCode?.(overrideCode);

        if (overrideCode !== GLOBAL_CODE) {
            updateTypeDropdowns(overrideCode);
            setOverrideLevel(overrideCode);
            initCompanyList();
        }
    };

    const updateTypeDropdowns = (overrideCode: string) => {
        setTypeDropDowns(getOverrideElements(overrideCode).map((t) => ({ code: t.code, title: t.value, value: ''})));
    }

    const initOverrideList = () : BasicEntity[] =>
        Object.values(OverrideEnumType).map((element) => ({
            name: element.value,
            value: element.code,
        }));

    const initCompanyList = load(async () => {
        const pCompanyData = await fetchData(OverrideEnumType.PCOMPANY.code, '', basicEntityService);
        setOptionGuidPairs((state) => ({
            ...state,
            pCompany: pCompanyData,
        }));
    });

    const loadRequirementGlobal = load(async () => {
        const globalRequirements = await fetchData(OverrideEnumType.REQUIREMENT.code, 'Global', basicEntityService);
        setOptionGuidPairs((state) => ({
            ...state,
            requirement: globalRequirements,
        }));
    });

    const renderOverrideLevel = () => {
        overrideLevelList = filteredOverrides ?? initOverrideList();
        return (
            <>
                {showGeneralComponent &&
                    <>
                        {overrideLevelList.length === 1 &&
                            <WarningMessage>
                                 {warningMessage}
                            </WarningMessage>
                        }

                        <InputText
                            type='custom-select'
                            value={overrideLevel}
                            label={showGeneralComponent ? (parentType === 'PLAN' ? 'Entity Level' : 'Override Level') : ''}
                            feedbackMsg={showMessageOverride && !overrideLevel ? MSG_REQUIRED_FIELD : ''}
                            disabled={overrideLevelList.length === 0}
                            options={overrideLevelList.map((o) => ({
                                label: o.name,
                                value: o.value,
                            }))}
                            onChange={(o: Options) => handleOverrideChanges(o.value)}
                            required
                        />
                    </>
                 }
            </>
        );
    };

    const handleOverrideChanges = (overrideCode: string) => {
        reset();
        setOverride?.('', overrideCode);
        updateTypeDropdowns(overrideCode)
        setOverrideLevel(overrideCode);
        setOverrideLevelCode?.(overrideCode);

        if (overrideCode === GLOBAL_CODE) {
            setOverride?.('', 'GLOBAL');

            // TODO - delete the next 2 lines when all components pass setOverride as parameter
            data.overrideGuid = '';
            data.overrideLevel = 'GLOBAL';
        } else {
            initCompanyList();
            loadRequirementGlobal();
        }
        setGeneralComponentState?.({ code: overrideCode, guid: '', overrideLevel: overrideCode });
    };

    const reset = () => {
        setOptionGuidPairs({
            pCompany: [],
            sCompany: [],
            product: [],
            plan: [],
            transaction: [],
            fund: [],
            requirement: [],
        });

        setGuidPCompany('');
    };

    const options = (typecode: string): BasicEntity[] => {
        if (typecode === OverrideEnumType.PCOMPANY.code) return optionGuidPairs.pCompany;
        if (typecode === OverrideEnumType.SCOMPANY.code) return optionGuidPairs.sCompany;
        if (typecode === OverrideEnumType.PRODUCT.code) return optionGuidPairs.product;
        if (typecode === OverrideEnumType.PLAN.code) return optionGuidPairs.plan;
        if (typecode === OverrideEnumType.TRANSACTION.code) return optionGuidPairs.transaction;
        if (typecode === OverrideEnumType.FUND.code) return optionGuidPairs.fund;
        if (typecode === OverrideEnumType.REQUIREMENT.code) return optionGuidPairs.requirement;

        return [];
    };

    const handleChanges = async (value: string, overrideCode: string, isLastSubComponent: boolean, indexOverride: number) => {
        isLastSubComponent && setValueSubComponent(value);
        const overrideLevelParam = getEnumKey(
            overrideCode.length === CUSTOM_CODES ? overrideCode.substring(1) : overrideCode,
        ) || '';

        // TODO - delete the next 2 lines when all components pass setOverride as parameter
        data.overrideGuid = value;
        data.overrideLevel = overrideLevelParam;

        if(value) {
            setTypeDropDowns(produce(typeDropDowns, (draft: Draft<DropdownOverride[]>) => {
                draft[indexOverride].value = value;
            }));
            setListOverride(produce(listOverride, (draft) => {
                draft.push({ code: overrideCode, guid: value, level:  overrideLevelParam });
            }));
            setOverride?.(value, overrideLevelParam);
            await handleNoValue(overrideCode);
            await handleFetchEntitiesUnder(overrideCode, value);
        } else {
            setTypeDropDowns(produce(typeDropDowns, (draft: Draft<DropdownOverride[]>) => {
                draft.forEach((d, i) => {
                    if(i >= indexOverride) {
                        d.value = '';
                    }
                });
            }));
            const index = listOverride.findIndex((o) => o.code === overrideCode);
            const newOverride = listOverride[ index - 1];
            if(newOverride) {
                const levelParam = getEnumKey(
                    newOverride.code.length === CUSTOM_CODES ? newOverride.code.substring(1) : newOverride.code,
                ) || '';
                setOverride?.(newOverride.guid, levelParam);
                await handleNoValue(newOverride.code);
                await handleFetchEntitiesUnder(newOverride.code, newOverride.guid);
            } else {
                setOverride?.('', overrideLevelParam);
                reset();
                await handleNoValue(overrideCode);
                handleOverrideChanges(overrideLevel);
            }

            setListOverride(produce(listOverride, (draft) => {
                draft.splice(index);
            }));
        }

        setGeneralComponentState?.({ code: overrideCode, guid: value, overrideLevel: overrideLevel });
    };

    const handleNoValue = load(async (code: string) => {
        switch (code) {
            case OverrideEnumType.PCOMPANY.code:
                reset();
                await initCompanyList();
                if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                    await loadRequirementGlobal();
                }
                break;
            case OverrideEnumType.PRODUCT.code:
                const planUnderPrimCompany = await fetchData(
                    OverrideEnumType.PLAN.code,
                    guidPcompany,
                    basicEntityService,
                );
                setOptionGuidPairs((state) => ({
                    ...state,
                    plan: planUnderPrimCompany,
                }));
                break;

        }
    })
    const handleFetchEntitiesUnder = load(async (code: string, value: string) => {
        switch (code) {
            case OverrideEnumType.PCOMPANY.code:
                setGuidPCompany(value);

                const subCompanies = await fetchData(OverrideEnumType.SCOMPANY.code, value, basicEntityService);
                setOptionGuidPairs((state) => ({
                    ...state,
                    sCompany: subCompanies,
                }));

                const plansUnderCompany = await fetchData(OverrideEnumType.PLAN.code, value, basicEntityService);
                setOptionGuidPairs((state) => ({
                    ...state,
                    plan: plansUnderCompany,
                }));

                if (overrideLevel === OverrideEnumType.FUND.code) {
                    const fundUnderCompany = await fetchData(OverrideEnumType.FUND.code, value, basicEntityService);
                    setOptionGuidPairs((state) => ({
                        ...state,
                        fund: fundUnderCompany,
                    }));
                }
                if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                    const requirementUnderCompany = await fetchData(
                        OverrideEnumType.REQUIREMENT.code,
                        value,
                        basicEntityService,
                        'COMPANY',
                    );
                    setOptionGuidPairs((state) => ({
                        ...state,
                        requirement: requirementUnderCompany,
                    }));
                }
                break;

            case OverrideEnumType.SCOMPANY.code:
                setOptionGuidPairs((state) => ({
                    ...state,
                    product: [],
                    plan: [],
                }));

                if (overrideLevel !== OverrideEnumType.SCOMPANY.code) {
                    const productUnderSubCompany = await fetchData(
                        OverrideEnumType.PRODUCT.code,
                        value,
                        basicEntityService,
                    );
                    setOptionGuidPairs((state) => ({
                        ...state,
                        product: productUnderSubCompany,
                    }));
                    if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                        const requirementUnderCompany = await fetchData(
                            OverrideEnumType.REQUIREMENT.code,
                            value,
                            basicEntityService,
                            'COMPANY',
                        );
                        setOptionGuidPairs((state) => ({
                            ...state,
                            requirement: requirementUnderCompany,
                        }));
                    }
                }
                break;

            case OverrideEnumType.PRODUCT.code:
                setOptionGuidPairs((state) => ({
                    ...state,
                    plan: [],
                }));

                const plansUnderProduct = await fetchData(
                    OverrideEnumType.PLAN.code,
                    value,
                    basicEntityService,
                    'PRODUCT',
                );
                setOptionGuidPairs((state) => ({
                    ...state,
                    plan: plansUnderProduct,
                }));

                if (overrideLevel === OverrideEnumType.TRANSACTION.code) {
                    const transactionUnderProduct = await fetchData(
                        OverrideEnumType.TRANSACTION.code,
                        value,
                        basicEntityService,
                    );
                    setOptionGuidPairs((state) => ({
                        ...state,
                        transaction: transactionUnderProduct,
                    }));
                }
                if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                    const requirementUnderProduct = await fetchData(
                        OverrideEnumType.REQUIREMENT.code,
                        value,
                        basicEntityService,
                        'PRODUCT',
                    );
                    setOptionGuidPairs((state) => ({
                        ...state,
                        requirement: requirementUnderProduct,
                    }));
                }
                break;

            case OverrideEnumType.PLAN.code:
                if (value) {
                    if (overrideLevel === OverrideEnumType.TRANSACTION.code) {
                        const transactionUnderPlan = await fetchData(
                            OverrideEnumType.TRANSACTION.code,
                            value,
                            basicEntityService,
                            'PLAN',
                        );
                        setOptionGuidPairs((state) => ({
                            ...state,
                            transaction: transactionUnderPlan,
                        }));
                    }
                    if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                        const requirementUnderPlan = await fetchData(
                            OverrideEnumType.REQUIREMENT.code,
                            value,
                            basicEntityService,
                            'PLAN',
                        );
                        setOptionGuidPairs((state) => ({
                            ...state,
                            requirement: requirementUnderPlan,
                        }));
                    }
                }
                break;
            case OverrideEnumType.TRANSACTION.code:
                if (value) {
                    if (overrideLevel === OverrideEnumType.REQUIREMENT.code) {
                        const requirementUnderPlan = await fetchData(
                            OverrideEnumType.REQUIREMENT.code,
                            value,
                            basicEntityService,
                            'TRANSACTIONS',
                        );
                        setOptionGuidPairs((state) => ({
                            ...state,
                            requirement: requirementUnderPlan,
                        }));
                    }
                }
                break;
            default:
                break;
        }
    });

    useEffect(() => {
        if(typeDropDowns?.length === 0){
            setIsOverrideValid?.(!!overrideLevel);
        } else {
            setIsOverrideValid?.(!!overrideLevel && !!valueSubComponent);
        }
    }, [overrideLevel, typeDropDowns, valueSubComponent]);

    const getFeedbackMessage = (index: number): string => {
        if(index === (typeDropDowns?.length ?? 0) - 1) {
            if(showMessageOverride && !valueSubComponent) {
                return MSG_REQUIRED_FIELD;
            }
        }
        return '';
    }

    return (
        <>
            {/* TODO - Allan - delete as soon all entityCreation components pass function load as parameter */}
            {!externalLoad ? <Loading loading={loading}/> : <></> }
            {renderOverrideLevel()}
            {typeDropDowns?.map((t, i) => (
                <SubComponent
                    key={t.code}
                    title={t.title}
                    value={t.value}
                    typeComponent={t.code}
                    handleChanges={(value, typeComponent) =>
                        handleChanges(value, typeComponent,i === typeDropDowns.length - 1, i)}
                    optionElements={options(t.code)}
                    required={i === typeDropDowns.length - 1}
                    feedbackMsg={getFeedbackMessage(i)}
                />
            ))}
        </>
    );
};

GeneralComponent.defaultProps = {
    basicEntityService: defaultBasicEntityService,
};

export default GeneralComponent;
