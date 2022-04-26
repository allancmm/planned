import { CollapseContainer, MultiSelect, useLoading} from 'equisoft-design-ui-elements';
import produce, {immerable} from 'immer';
import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import CreateRequirementDefinitionRequest, {
    CategoryCode,
    LevelCode,
    SeverityCode,
} from '../../../lib/domain/entities/createRequirementDefinitionRequest';
import {AttachedRuleDto} from '../../../lib/domain/entities/createTransactionRequest';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import { AttachedRulesContainer } from './style';
import { AuthContext } from '../../../page/authContext';
import GeneralComponent from '../../general/components/generalComponent';
import {getEnumKey, OverrideEnumType} from '../../general/components/overrideEnum';
import {InputText, Options} from "../../../components/general";
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

type TypeGeneralFields = 'templateName' | 'manualResult' | 'categoryCode' | 'levelCode' | 'severityCode' |
                          'description' | 'requirementName' | 'resultsObsoleteDays';

const manualResults = [
    { name: 'True', value: '1' },
    { name: 'False', value: '0' },
];

interface RequirementDefinitionProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    xmlTemplateService: XmlTemplateService;
}

const RequirementDefinitionCreationWizard = ({
    entityService,
    entityInformationService,
    xmlTemplateService,
}: RequirementDefinitionProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const { auth } = useContext(AuthContext);
    const [loading, load] = useLoading();

    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [attachedRules, setAttachedRules] = useState<AttachedRuleDto[]>([]);
    const [selectedAttachedRules, setSelectedAttachedRules] = useState<string[]>([]);
    const [availableCategoryCode, setAvailableCategoryCode] = useState<CategoryCode[]>([]);
    const [availableLevelCode, setAvailableLevelCode] = useState<LevelCode[]>([]);
    const [availableSeveriryCode, setAvailableSeveriryCode] = useState<SeverityCode[]>([]);
    const [request, setRequest] = useState<CreateRequirementDefinitionRequest>(
        new CreateRequirementDefinitionRequest(),
    );

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsManualResults = useMemo(() =>
        [{label: manualResults.length > 0 ? 'Select One' : ' No Manual result Available', value: ''},
            ...manualResults.map((mr) => ({
                label: mr.name,
                value: mr.value,
            }))], [manualResults]);

    const optionsCategoryCode = useMemo(() =>
        [{ label: availableCategoryCode.length > 0 ? 'Select Category Code' : ' No Category Code Available', value: '' },
            ...availableCategoryCode.map((code) => ({
                label: code.shortDescription,
                value: code.codeValue,
            }))], [availableCategoryCode]);

    const optionsLevelCode = useMemo(() =>
        [{ label: availableCategoryCode.length > 0 ? 'Select Level Code' : ' No Level Code Available', value: ''},
            ...availableLevelCode.map((code) => ({
                label: code.shortDescription,
                value: code.codeValue,
            }))], [availableLevelCode]);

    const optionsSeverityCode = useMemo(() =>
        [{ label: availableCategoryCode.length > 0 ? 'Select Severity Code' : ' No Severity Code Available', value: '' },
            ...availableSeveriryCode.map((code) => ({
                label: code.shortDescription,
                value: code.codeValue,
            }))], [availableSeveriryCode]);

    const optionsTemplate = useMemo(() =>
        [{label: templates.length > 0 ? 'Select One' : ' No Template Available', value: ''},
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            }))], [templates]);

    const optionsAttachedRule = useMemo(() => attachedRules.map((rule) => ({
        id: attachedRules.indexOf(rule),
        label: rule.name,
    })), [attachedRules]);

    const fetchData = async () => {
        setTemplates(await xmlTemplateService.getTemplates('requirement', ''));
        setAttachedRules(await entityService.getLevelAttachedRules('REQUIREMENT'));
        setAvailableCategoryCode(await entityService.getCategoryCodes());
        setAvailableLevelCode(await entityService.getLevelCodes());
        setAvailableSeveriryCode(await entityService.getSeverityCodes());
    };

    useEffect(() => {
        request.overrideLevel = getEnumKey(OverrideEnumType.GLOBAL.code);
        request.overrideGuid = '';
        fetchData();
    }, []);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={getFilteredOverrides()}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const getFilteredOverrides = () => {
        const list = [
            { name: OverrideEnumType.GLOBAL.value, value: OverrideEnumType.GLOBAL.code },
            { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
            { name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code }
        ]

        if (auth.oipaVersion === '113' || auth.oipaVersion === '112') {
            list.push({ name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code })
        }

        list.push({ name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code })
        return list;
    }

    const renderManualResultsField = () => {
        return (
            <InputText
                value={request.manualResult}
                type='custom-select'
                label="Manual Results"
                options={optionsManualResults}
                onChange={(o: Options) => onChangeGeneralField('manualResult', o.value)}
            />
        );
    };

    const renderCategoryCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.categoryCode}
                label="Category Code"
                options={optionsCategoryCode}
                onChange={(o: Options) => onChangeGeneralField('categoryCode', o.value)}
            />
        );
    };

    const renderLevelCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.levelCode}
                label="Level Code"
                options={optionsLevelCode}
                onChange={(o: Options) => onChangeGeneralField('levelCode', o.value)}
            />
        );
    };

    const renderSeverityCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.severityCode}
                label="Severity Code"
                options={optionsSeverityCode}
                onChange={(o: Options) => onChangeGeneralField('severityCode', o.value)}
            />
        );
    };

    const renderTemplates = () => {
        return (
            <InputText
                type='custom-select'
                value={request.templateName}
                label="Template"
                options={optionsTemplate}
                onChange={(o: Options) => onChangeGeneralField('templateName', o.value)}
            />
        );
    };

    const renderAttachedRules = () => {
        return(
            <AttachedRulesContainer>
                <MultiSelect
                    name={'Attached Rules'}
                    items={optionsAttachedRule}
                    selectedItems={selectedAttachedRules}
                    onChange={handleAttachedRule}
                />
            </AttachedRulesContainer>
        );
    };

    const onChangeGeneralField = (field: TypeGeneralFields, value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
    }

    const handleAttachedRule = (selected: string[]) => {
        setSelectedAttachedRules(selected);
        setRequest(
            produce(request, (draft) => {
                draft.attachedRules = selected;
            }),
        );
    };

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if(!request.requirementName) {
            newError.requirementName = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if(!request.description) {
            newError.description = MSG_REQUIRED_FIELD;
            isValid = false;
        }
        setErrorValidation(newError);

        if(!isOverrideValid) {
            isValid = false;
        }

        setErrorValidation(newError);
        !isValid && setShowMessageOverride(true);
        return isValid;
    }
    const createRequirement = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            if (request.resultsObsoleteDays === '') {
                request.resultsObsoleteDays = '0';
            }
            const createdEntities = await entityService.createRequirement(request);
            for (const entity of createdEntities) {
                const entityInformation = await entityInformationService.getEntityInformation(
                    entity.entityType,
                    entity.getGuid(),
                    'XML_DATA',
                );
                dispatch({ type: OPEN, payload: { data: entityInformation }});
            }
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Requirement'
            loading={loading}
            onSubmit={createRequirement}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.requirementName}
                        label="Requirement Name"
                        feedbackMsg={errorValidation.requirementName}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            onChangeGeneralField('requirementName', e.target.value);
                            setErrorValidation(produce(errorValidation, (draft) => {
                                draft.requirementName = '';
                            }));
                        }}
                    />
                    <InputText
                        type='text'
                        value={request.description}
                        label="Description"
                        feedbackMsg={errorValidation.description}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            onChangeGeneralField('description', e.target.value);
                            setErrorValidation(produce(errorValidation, (draft) => {
                                draft.description = '';
                            }));
                        }}
                    />
                    {renderManualResultsField()}
                    {renderCategoryCodeField()}
                    {renderLevelCodeField()}
                    {renderSeverityCodeField()}
                    <InputText
                        label="Results Obsolete Days"
                        value={request.resultsObsoleteDays}
                        type="number"
                        onChange={(value: string) => onChangeGeneralField('resultsObsoleteDays',value + "")}
                    />
                </PanelSectionContainer>
            </CollapseContainer>

            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>

            <CollapseContainer title={'Template'}>
                <PanelSectionContainer>
                    {renderTemplates()}
                </PanelSectionContainer>
            </CollapseContainer>

            {attachedRules.length > 0 &&
                <CollapseContainer title="Attached Rules">
                    <PanelSectionContainer>
                        {renderAttachedRules()}
                    </PanelSectionContainer>
                </CollapseContainer>
            }
        </FrameworkComponent>
    );
};

RequirementDefinitionCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default RequirementDefinitionCreationWizard;

class ErrorValidation {
    [immerable] = true;
    requirementName = '';
    description = ''
}