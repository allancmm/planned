import React, { FormEvent, useContext, useEffect, useState } from "react";
import produce from "immer";
import {Loading, Select, TextInput, useLoading} from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import { toast } from "react-toastify";
import { PanelTitle } from "../../../components/general/sidebar/style";
import { ButtonSection } from "../../../components/general";
import {StateCode} from '../../../lib/domain/entities/createRequirementDefinitionRequest';
import EntityDuplicateService from "../../../lib/services/entityDuplicateService";
import {
    defaultEntitiesService,
    defaultEntityDuplicateService,
    defaultEntityInformationService,
    defaultSearchRulesService
} from "../../../lib/context";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import formLayout from '../../entityCreation/businessRules/formBusinessRules';
import { CheckoutSwitch } from "../general/checkout";
import { DuplicateContainer } from "../styles";
import { DuplicateBusinessRules } from "../../../lib/domain/entities/duplicateBusinessRules";
import { getBasicEntity, getEnumKey, OverrideEnumType } from "../../general/components/overrideEnum";
import GeneralComponent from "../../general/components/generalComponent";
import CreateTransactionRuleRequest from "../../../lib/domain/entities/createTransactionRequest";
import StateGeneralProps from "../../general/components/stateGeneralProps";
import EntityService from "../../../lib/services/entitiesService";
import SearchRulesService from "../../../lib/services/searchRulesService";
import BasicEntity from "../../../lib/domain/entities/basicEntity";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import EntityInformationService from "../../../lib/services/entityInformationService";
import { useTabActions } from "../../../components/editor/tabs/tabContext";

type TypeAllowBusinessRules = string | Boolean;
const SYSTEM_CODE = 'AsCodeSystem';

interface BusinessRulesProp {
    sourceBusinessRules: DuplicateBusinessRules;
    entityDuplicateService: EntityDuplicateService,
    entityService: EntityService,
    searchRulesService: SearchRulesService,
    entityInformationService: EntityInformationService
}

const BusinessRules = ({ sourceBusinessRules,
    entityDuplicateService,
    entityService,
    searchRulesService,
    entityInformationService }: BusinessRulesProp) => {

    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const { closeRightbar } = useContext(RightbarContext);

    const [businessRules, setBusinessRules] = useState<DuplicateBusinessRules>(sourceBusinessRules);

    const request = new CreateTransactionRuleRequest();

    const [isBusinessRuleExist, setIsBusinessRuleExist] = useState<boolean>();

    const [renderGeneralComponent, setRenderGeneralComponent] = useState<React.ReactElement>();

    const [overridesList, setOverridesList] = useState<BasicEntity[]>([]);

    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const [overrideLevelCode, setOverrideLevelCode] = useState<string>('');
    const [states, setStates] = useState<StateCode[]>([]);
    const [stateOverrideExist, setStateOverrideExist] = useState<boolean>(false);
    const [systemCodeTypes, setSystemCodeTypes] = useState<BasicEntity[]>([]);
    const [systemOverrideExist, setSystemOverrideExist] = useState<boolean>(false);
    const [displaySubInfo, setDisplaySubInfo] = useState<boolean>(false);

    useEffect(() => {
        initOverrideList();
        initState();
        initSystemCode();
    }, []);

    useEffect(() => {
        generalComponentState?.guid && onChange('overrideGuid', generalComponentState?.guid);
    }, [generalComponentState]);

    useEffect(() => {
        setBusinessRules(produce(businessRules, (draft) => {
            draft.createCheckedOut = sourceBusinessRules.createCheckedOut;
        }));
    }, [sourceBusinessRules.sourceEntityGuid]);

    useEffect(() => {
        overridesList.length > 0 &&
            setRenderGeneralComponent(
                <GeneralComponent
                    data={request}
                    warningMessage={isBusinessRuleExist === false ? 'Global override must be created first.' : ''}
                    filteredOverrides={overridesList}
                    setOverridesList={setOverridesList}
                    setGeneralComponentState={setGeneralComponentState}
                    setOverrideLevelCode={setOverrideLevelCode}
                />,
            );
    }, [overridesList]);

    useEffect(() => {
        setDisplaySubInfo(![OverrideEnumType.GLOBAL.code, OverrideEnumType.PCOMPANY.code, ''].includes(overrideLevelCode));
    }, [overrideLevelCode]);

    const duplicateBusinessRules = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        businessRules.overrideLevel = overridesList.find((o) => o.value === overrideLevelCode)?.name ?? '';
        if (businessRules.overrideLevel === OverrideEnumType.SCOMPANY.value ||
            businessRules.overrideLevel === OverrideEnumType.PCOMPANY.value) {
            businessRules.overrideLevel = OverrideEnumType.COMPANY.value;
        }
        const businessRuleCreated = await entityDuplicateService.duplicateBusinessRules(businessRules);
        const entityInformation = await entityInformationService.getEntityInformation(
            businessRuleCreated.entityType,
            businessRuleCreated.getGuid(),
            'XML_DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });

        toast.success('Business Rules duplicated successfully');
        closeRightbar();
    });

    const onChange = (field: keyof DuplicateBusinessRules, value: TypeAllowBusinessRules) => {
        setBusinessRules(produce(businessRules, (draft) => {
            (draft[field] as TypeAllowBusinessRules) = value;
        }));
    };

    const convertOverride = (overrides: any[]) => {
        const filteredOverrides: BasicEntity[] = [];
        overrides.forEach((o) => {
            const overrideElement = getBasicEntity(o);
            if (overrideElement) filteredOverrides.push(overrideElement);
        });
        if (filteredOverrides.length >= 1) {
            filteredOverrides.unshift({ name: 'Select Override Level', value: '' });
        }
        setOverridesList(filteredOverrides);
    };

    const getTypeCode = (codeLabel: string) => {
        switch (codeLabel.toUpperCase()) {
            case 'SYSTEM':
            case 'SCREEN':
                return  formLayout.SYSTEM.code;
            case 'COPYBOOK':
                return formLayout.COPYBOOK.code;
            case 'FUNCTION':
                return formLayout.FUNCTION.code;
            case 'MULTIFIELD':
                return formLayout.MULTIFIELD.code;
            case 'EXPOSED COMPUTATION':
                return formLayout.EXPOSED_COMPUTATION.code;
            case 'ATTACHED RULE':
                return formLayout.ATTACHED_RULE.code;
            case 'PLAN RULE':
                return formLayout.PLAN_RULE.code;
            case 'CALCULATE':
                return formLayout.CALCULATE.code;
            case 'COMPUTATION':
                return formLayout.COMPUTATION.code;
            case 'WIDGET':
                return formLayout.WIDGET.code;
            default:
                return '';
        }
    }

    const renderStateField = () => {
        return (
            <Select
                label="State"
                emptySelectText={states.length > 0 ? 'Select State' : ' No State Available'}
                options={states.map((p) => ({
                    label: p.shortDescription,
                    value: p.codeValue,
                }))}
                onChange={(e) => handleStateField(e.target.value)}
            />
        );
    };

    const handleStateField = async (code: string) => {
        setBusinessRules(
            produce(businessRules, (draft) => {
                draft.stateCode = code;
            }),
        );
    };

    const renderSystemCode = () => {
        return (
            <Select
                label="System Code"
                emptySelectText={systemCodeTypes.length > 0 ? 'Select One' : ' No System Code available'}
                disabled={systemCodeTypes.length === 0}
                options={systemCodeTypes.map((sct) => ({
                    label: sct.name,
                    value: sct.value,
                }))}
                onChange={(ex) => handleSystemCode(ex.target.value)}
            />
        );
    };

    const handleSystemCode = async (code: string) => {
        setBusinessRules(
            produce(businessRules, (draft) => {
                draft.systemCode = code;
            }),
        );
    };

    const initOverrideList = () => {
        load(async () => {
            let overrides = await entityService.getAvailableBusinessRuleOverrides(
                getTypeCode(sourceBusinessRules.typeCode),
                sourceBusinessRules.newEntityName,
            );
            const businessRuleExist = await searchRulesService.isBusinessRuleExist(sourceBusinessRules.newEntityName);
            setIsBusinessRuleExist(businessRuleExist);
            if (!businessRuleExist) {
                overrides = [getEnumKey(OverrideEnumType.GLOBAL.code)];
            }

            setStateOverrideExist(overrides.includes('STATE'));
            setSystemOverrideExist(overrides.includes('SYSTEM'));
            convertOverride(overrides);
        })();
    };

    const initState = async () => {
        setStates(await load(entityService.getStateCodes)());
    };

    const initSystemCode = async () => {
        setSystemCodeTypes(await load(entityService.getCodes)(SYSTEM_CODE));
    };

    const editableName = (type: string): boolean => {
        return type === "System" || type === "Screen" || type === "Attached Rule" || type === "Plan Rule" || type === "Widget";
    };

    return (
        <>
            <PanelTitle>Duplicate Business Rules</PanelTitle>

            <DuplicateContainer onSubmit={duplicateBusinessRules}>
                <Loading loading={loading} />

                <TextInput
                    defaultValue={businessRules.typeCode}
                    label="Business Rule Type"
                    required
                    onChange={() => { }}
                    disabled
                />

                <TextInput
                    defaultValue={businessRules.newEntityName}
                    label="Business Rule Name"
                    required
                    onChange={(e) => onChange('newEntityName', e.target.value)}
                    disabled={editableName(businessRules.typeCode)}
                />
                <hr />
                {renderGeneralComponent}
                {stateOverrideExist && displaySubInfo ? renderStateField() : ''}
                {systemOverrideExist && displaySubInfo ? renderSystemCode() : ''}
                <hr />
                <CheckoutSwitch createCheckedOut={businessRules.createCheckedOut} onChange={onChange} />

                <ButtonSection>
                    <Button buttonType="primary"
                        label='Save' />
                </ButtonSection>
            </DuplicateContainer>

        </>);
}

BusinessRules.defaultProps = {
    entityDuplicateService: defaultEntityDuplicateService,
    entityService: defaultEntitiesService,
    searchRulesService: defaultSearchRulesService,
    entityInformationService: defaultEntityInformationService
};

export default BusinessRules;