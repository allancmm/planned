import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { InputText, Options } from '../../../components/general';
import useDebouncedSearch from '../../../components/general/hooks/useDebounceSearch';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { MSG_REQUIRED_FIELD } from '../../../lib/constants';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultSearchRulesService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateBusinessRuleRequest from '../../../lib/domain/entities/createBusinessRuleRequest';
import { StateCode } from '../../../lib/domain/entities/createRequirementDefinitionRequest';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import { BusinessRuleTypeCode } from '../../../lib/domain/enums/businessRuleTypeCode';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import SearchRulesService from '../../../lib/services/searchRulesService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { getBasicEntity, getEnumKey, OverrideEnumType } from '../../general/components/overrideEnum';
import TemplateComponent from '../../general/components/templateComponent';
import FrameworkComponent from '../frameworkComponent';
import formLayout from './formBusinessRules';

const SYSTEM_CODE = 'AsCodeSystem';
const COPYBOOK_TYPE_CODE = '04';

interface BusinessRuleCreationShortCutProps {
    isFastCreation: boolean;
    defaultName: string;
    overrideGuid: string;
    overrideLevel: string;
    typeCode: string;
    isNewLine: boolean;
    copybookContent: string;
    convertSelection: boolean;
    handleBusinessRuleName(newName: string, originalName: string, isNewLine: boolean, isSelection: boolean): void;
}

interface BusinessRuleCreationProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    businessRuleTypeCode?: BusinessRuleTypeCode;
    searchRulesService: SearchRulesService;
    extraData: BusinessRuleCreationShortCutProps;
}

const BusinessRuleCreationWizard = ({
    xmlTemplateService,
    entityService,
    entityInformationService,
    businessRuleTypeCode,
    searchRulesService,
    extraData,
}: BusinessRuleCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const [isDropdown, setIsDropdown] = useState<boolean>(false);
    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [names, setNames] = useState<string[]>([]);
    const [request, setRequest] = useState<CreateBusinessRuleRequest>(
        !extraData
            ? new CreateBusinessRuleRequest()
            : new CreateBusinessRuleRequest(
                  extraData.defaultName,
                  extraData.overrideGuid,
                  extraData.typeCode,
                  extraData.overrideLevel,
                  extraData.copybookContent,
              ),
    );
    const [nameErrors, setNameErrors] = useState<string[]>([]);
    const [states, setStates] = useState<StateCode[]>([]);
    const [stateOverrideExist, setStateOverrideExist] = useState<boolean>(false);
    const [isBusinessRuleExist, setIsBusinessRuleExist] = useState<boolean>();
    const [systemCodeTypes, setSystemCodeTypes] = useState<BasicEntity[]>([]);
    const [systemOverrideExist, setSystemOverrideExist] = useState<boolean>(false);
    const [displaySubInfo, setDisplaySubInfo] = useState<boolean>(false);
    const [ruleType, setRuleType] = useState<BusinessRuleTypeCode>();
    const [debouncedRuleName, setDebouncedRuleName] = useState(request.businessRuleName);
    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [overridesList, setOverridesList] = useState<BasicEntity[]>([]);
    const [overrideLevelCode, setOverrideLevelCode] = useState<string>('');
    const [renderGeneralComponent, setRenderGeneralComponent] = useState<React.ReactElement>();
    const [errorValidation, setErrorValidation] = useState({ ruleType: '' });
    let oldBuisnessRule = '';

    const optionsRuleType = useMemo(
        () =>
            Object.values(formLayout).map((f) => ({
                label: f.label,
                value: f.value,
            })),
        [formLayout],
    );

    const optionsRuleName = useMemo(
        () => [
            { label: 'Select one', value: '' },
            ...names.map((f) => ({
                label: f,
                value: f,
            })),
        ],
        [names],
    );

    const optionsTemplate = useMemo(
        () => [
            { label: templates.length > 0 ? 'Select One' : ' No Template Available', value: '' },
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            })),
        ],
        [templates],
    );

    const optionsState = useMemo(
        () => [
            { label: states.length > 0 ? 'Select State' : ' No State Available', value: '' },
            ...states.map((p) => ({
                label: p.shortDescription,
                value: p.codeValue,
            })),
        ],
        [states],
    );

    const optionsSystemCode = useMemo(
        () => [
            { label: systemCodeTypes.length > 0 ? 'Select One' : ' No System Code available', value: '' },
            ...systemCodeTypes.map((sct) => ({
                label: sct.name,
                value: sct.value,
            })),
        ],
        [systemCodeTypes],
    );

    const useSearch = () =>
        useDebouncedSearch((ruleName: string) => {
            setDebouncedRuleName(ruleName);
        });

    const { inputText, setInputText } = useSearch();

    useEffect(() => {
        if (extraData?.isFastCreation) {
            setRequest(
                produce(request, (draft) => {
                    draft.typeCode = extraData.typeCode;
                }),
            );
            setRuleType(extraData?.typeCode === COPYBOOK_TYPE_CODE ? 'COPYBOOK' : '');
            setInputText(extraData.defaultName);
            setIsOverrideValid(true);
            if (extraData?.convertSelection) {
                setRequest(
                    produce(request, (draft) => {
                        draft.selectedContent = extraData.copybookContent;
                        draft.typeCode = COPYBOOK_TYPE_CODE;
                    }),
                );
            }
        }
    }, [extraData]);

    useEffect(() => {
        initState();
        initSystemCode();
        request.overrideLevel = getEnumKey(OverrideEnumType.GLOBAL.code);
        request.overrideGuid = '';
        setOverrideLevelCode('');
    }, []);

    useEffect(() => {
        setRenderGeneralComponent(
            <GeneralComponent
                data={request}
                warningMessage={isBusinessRuleExist === false ? 'Global override must be created first.' : ''}
                filteredOverrides={overridesList}
                setOverridesList={setOverridesList}
                setOverrideLevelCode={setOverrideLevelCode}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                load={load}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />,
        );
    }, [overridesList, showMessageOverride]);

    useEffect(() => {
        setRequest(
            produce(request, (draft) => {
                draft.businessRuleName = debouncedRuleName;
            }),
        );
        if (debouncedRuleName !== oldBuisnessRule) {
            iniOverrideList();
            oldBuisnessRule = debouncedRuleName;
        }
    }, [debouncedRuleName]);

    useEffect(() => {
        setDisplaySubInfo(
            ![OverrideEnumType.GLOBAL.code, OverrideEnumType.PCOMPANY.code, ''].includes(overrideLevelCode),
        );
    }, [overrideLevelCode]);

    const iniOverrideList = async () => {
        let overrides = await load(entityService.getAvailableBusinessRuleOverrides)(
            request.typeCode,
            debouncedRuleName,
        );
        const businessRuleExist = await load(searchRulesService.isBusinessRuleExist)(debouncedRuleName);
        setIsBusinessRuleExist(businessRuleExist);

        if (!businessRuleExist) {
            overrides = [getEnumKey(OverrideEnumType.GLOBAL.code)];
        }

        setStateOverrideExist(overrides.includes('STATE'));
        setSystemOverrideExist(overrides.includes('SYSTEM'));
        convertOverride(overrides);
    };

    const initState = async () => {
        setStates(await load(entityService.getStateCodes)());
    };

    const initSystemCode = async () => {
        setSystemCodeTypes(await load(entityService.getCodes)(SYSTEM_CODE));
    };

    const validateRuleName = (value: string) => {
        const errors: string[] = [];
        setRenderGeneralComponent(undefined);
        

        if (value === '') {
            setOverridesList([]);
            errors.push('Business Rule Name required');
        } else if (value.includes(' ')) {
            errors.push('Business Rule Name cannot contain spaces');
        }
        setNameErrors(errors);
    };

    const renderNameField = () => {
        if (isDropdown) {
            return (
                <InputText
                    type="custom-select"
                    value={request.businessRuleName}
                    label="Business Rule Name"
                    options={optionsRuleName}
                    onChange={(o: Options) => handleSelectRuleName(o.value)}
                />
            );
        } else {
            return (
                <InputText
                    label="Business Rule Name"
                    value={inputText}
                    feedbackMsg={nameErrors[0]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.trim();
                        validateRuleName(value);
                        setInputText(value);
                    }}
                />
            );
        }
    };

    const convertOverride = (overrides: any[]) => {
        const filterdOverrides: BasicEntity[] = [];
        overrides.forEach((o) => {
            const overrideElement = getBasicEntity(o);
            if (overrideElement) filterdOverrides.push(overrideElement);
        });
        if (filterdOverrides.length >= 1) {
            filterdOverrides.unshift({ name: 'Select Override Level', value: '' });
            setOverrideLevelCode('');
        }
        setOverridesList(filterdOverrides);
    };

    const handleSelectRuleName = (val: string) => {
        validateRuleName(val);
        setInputText(val);
        setRequest(
            produce(request, (draft) => {
                draft.businessRuleName = val;
            }),
        );
    };

    const handleTemplateChange = (value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.templateName = value;
            }),
        );
    };

    const renderStateField = () => {
        return (
            <InputText
                type="custom-select"
                value={request.stateCode}
                label="State"
                options={optionsState}
                onChange={(o: Options) => handleStateField(o.value)}
            />
        );
    };

    const handleStateField = async (code: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.stateCode = code;
            }),
        );
    };

    const renderSystemCode = () => {
        return (
            <InputText
                type="custom-select"
                value={request.systemCode}
                label="System Code"
                disabled={systemCodeTypes.length === 0}
                options={optionsSystemCode}
                onChange={(o: Options) => handleSystemCode(o.value)}
            />
        );
    };

    const handleSystemCode = async (code: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.systemCode = code;
            }),
        );
    };

    const validateForm = () => {
        let isValid = true;
        if (!ruleType) {
            isValid = false;
            setErrorValidation({ ruleType: MSG_REQUIRED_FIELD });
        }

        if (extraData?.isFastCreation && request.businessRuleName === '') {
            isValid = false;
            toast.error('Enter Copybook name');
        }

        if (!isOverrideValid) {
            isValid = false;
        }

        !isValid && setShowMessageOverride(true);
        return isValid;
    };
    const createBusinessRule = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (extraData?.isFastCreation && isBusinessRuleExist) {
            toast.error('This copybook name early exists');
        } else {
            if (validateForm()) {
                const br = await load(entityService.createBusinessRule)(request);
                const entityInformation = await load(entityInformationService.getEntityInformation)(
                    br.entityType,
                    br.getGuid(),
                    'XML_DATA',
                );

                if (extraData?.isFastCreation) {
                    extraData?.handleBusinessRuleName(
                        request.businessRuleName,
                        extraData.defaultName,
                        extraData.isNewLine,
                        extraData.convertSelection,
                    );
                }

                dispatch({ type: OPEN, payload: { data: entityInformation } });

                closeRightbar();
            }
        }
    });

    const handleSelectRuleType = async (o: Options) => {
        const value = o.value as BusinessRuleTypeCode;
        setRuleType(value);
        let tmpTemplates;
        let tmpNames: string[];
        let newRuleName: string;
        let newTypeCode: string;

        setOverridesList([]);
        setRenderGeneralComponent(undefined);

        switch (value) {
            case 'SYSTEM':
                setIsDropdown(true);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.SYSTEM.label, '');
                tmpNames = await load(entityService.getBusinessRulesNames)(formLayout.SYSTEM.code);
                newRuleName = '';
                newTypeCode = formLayout.SYSTEM.code;
                setNames(tmpNames);
                setTemplates(tmpTemplates);
                break;
            case 'COPYBOOK':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.COPYBOOK.label, '');
                newRuleName = `${formLayout.COPYBOOK.label}-`;
                newTypeCode = formLayout.COPYBOOK.code;
                setTemplates(tmpTemplates);
                break;
            case 'COMPUTATION':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.COMPUTATION.label, '');
                newRuleName = `${formLayout.COMPUTATION.label}-`;
                newTypeCode = formLayout.COMPUTATION.code;
                setTemplates(tmpTemplates);
                break;
            case 'FUNCTION':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.FUNCTION.label, '');
                newRuleName = `${formLayout.FUNCTION.label}-`;
                newTypeCode = formLayout.FUNCTION.code;
                setTemplates(tmpTemplates);
                break;
            case 'MULTIFIELD':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.MULTIFIELD.label, '');
                newRuleName = `${formLayout.MULTIFIELD.label}-`;
                newTypeCode = formLayout.MULTIFIELD.code;
                setTemplates(tmpTemplates);
                break;
            case 'SCREEN':
                setIsDropdown(true);
                newRuleName = '';
                newTypeCode = formLayout.SCREEN.code;
                tmpNames = await load(entityService.getBusinessRulesNames)(formLayout.SCREEN.code);
                setNames(tmpNames);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.SCREEN.label, '');
                setTemplates(tmpTemplates);
                break;
            case 'EXPOSED_COMPUTATION':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.EXPOSED_COMPUTATION.label, '');
                newRuleName = '';
                newTypeCode = formLayout.EXPOSED_COMPUTATION.code;
                setTemplates(tmpTemplates);
                break;
            case 'ATTACHED_RULE':
                setIsDropdown(true);
                tmpNames = await load(entityService.getBusinessRulesNames)(formLayout.ATTACHED_RULE.code);
                setNames(tmpNames);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.ATTACHED_RULE.label, '');
                newRuleName = '';
                newTypeCode = formLayout.ATTACHED_RULE.code;
                setTemplates(tmpTemplates);
                break;
            case 'PLAN_RULE':
                setIsDropdown(true);
                tmpNames = await load(entityService.getBusinessRulesNames)(formLayout.PLAN_RULE.code);
                setNames(tmpNames);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.PLAN_RULE.label, '');
                newRuleName = '';
                newTypeCode = formLayout.PLAN_RULE.code;
                setTemplates(tmpTemplates);
                break;
            case 'CALCULATE':
                setIsDropdown(false);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.CALCULATE.label, '');
                newRuleName = `${formLayout.CALCULATE.label}-`;
                newTypeCode = formLayout.CALCULATE.code;
                setTemplates(tmpTemplates);
                break;
            case 'WIDGET':
                setIsDropdown(true);
                tmpNames = await load(entityService.getBusinessRulesNames)(formLayout.WIDGET.code);
                setNames(tmpNames);
                tmpTemplates = await load(xmlTemplateService.getTemplates)(formLayout.WIDGET.label, '');
                newRuleName = '';
                newTypeCode = formLayout.WIDGET.code;
                setTemplates(tmpTemplates);
                break;
            case '':
            default:
                setIsDropdown(false);
                setTemplates([]);
                newRuleName = '';
                newTypeCode = '';
                break;
        }
        setRequest(
            produce(request, (draft) => {
                draft.businessRuleName = newRuleName;
                draft.typeCode = extraData?.isFastCreation ? extraData.typeCode : newTypeCode;
            }),
        );

        setInputText(newRuleName);
        setErrorValidation({ ruleType: '' });
    };

    const getTitle = () => {
        if (extraData?.isFastCreation) {
            return 'Create New Global CopyBook';
        } else {
            return 'Create Business Rule';
        }
    };

    return (
        <FrameworkComponent
            title={businessRuleTypeCode ? `Create ${businessRuleTypeCode}` : getTitle()}
            loading={loading}
            onSubmit={createBusinessRule}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type="custom-select"
                        value={ruleType}
                        label="Business Rule Type"
                        feedbackMsg={errorValidation.ruleType}
                        options={optionsRuleType}
                        required
                        disabled={extraData?.isFastCreation}
                        onChange={handleSelectRuleType}
                    />
                    <>{renderNameField()}</>
                </PanelSectionContainer>
            </CollapseContainer>

            {!extraData?.isFastCreation && (
                <CollapseContainer title="Override" defaultOpened>
                    <PanelSectionContainer>
                        {renderGeneralComponent}
                        {stateOverrideExist && displaySubInfo ? renderStateField() : ''}
                        {systemOverrideExist && displaySubInfo ? renderSystemCode() : ''}
                    </PanelSectionContainer>
                </CollapseContainer>
            )}
            {!extraData?.isFastCreation && (
                <CollapseContainer title="Template" defaultOpened>
                    <PanelSectionContainer>
                        <TemplateComponent
                            name={request.templateName}
                            options={optionsTemplate}
                            disabled={templates.length === 0}
                            onChange={handleTemplateChange}
                        />
                    </PanelSectionContainer>
                </CollapseContainer>
            )}
        </FrameworkComponent>
    );
};

BusinessRuleCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    searchRulesService: defaultSearchRulesService,
};

export default BusinessRuleCreationWizard;
