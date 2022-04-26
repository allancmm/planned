import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import {CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import { immerable, produce } from 'immer';
import {InputText, Options} from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import CreateQuoteDefinitionRequest from '../../../lib/domain/entities/createQuoteDefinitionRequest';
import MapKeyValue from '../../../lib/domain/entities/mapKeyValue';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import FrameworkComponent from "../frameworkComponent";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import TemplateComponent from "../../general/components/templateComponent";
import {validateRequiredFields} from "../util";

const typeFieldString = ['quoteName', 'typeCode', 'statusCode', 'templateName'] as const;
type TypeFieldString = typeof typeFieldString[number];
const isFieldString = (field: any) : field is TypeFieldString => typeFieldString.includes(field);

const TYPE_CODE = 'AsCodeQuoteType';
const STATUS_CODE = 'AsCodeQuoteStatus';
const FILTERED_OVERRIDE = [
    { name: OverrideEnumType.GLOBAL.value, value: OverrideEnumType.GLOBAL.code },
    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
];

class QuoteDefinition {
    [immerable] = true;
    quoteName = '';
    effectiveFrom = '';
    typeCode = '';
    statusCode = '';
}
interface QuoteDefinitionProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const QuoteDefinitionCreationWizard = ({
    entityService,
    xmlTemplateService,
    entityInformationService,
}: QuoteDefinitionProps) => {
    const [loading, load] = useLoading();
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);

    const [request, setRequest] = useState<CreateQuoteDefinitionRequest>(new CreateQuoteDefinitionRequest());
    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [codeTypes, setCodeTypes] = useState<MapKeyValue[]>([]);
    const [statusTypes, setStatusTypes] = useState<MapKeyValue[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new QuoteDefinition());

    const optionsTemplate = useMemo(() => [
        { label: templates.length > 0 ? 'Select One' : ' No Template Available', value: ''},
          ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            }))], [templates]);

    const optionsTypeCode = useMemo(() => [
        { label: codeTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
        ...codeTypes.map((code) => ({
            label: code.shortDescription,
            value: code.codeValue,
        }))
    ], [codeTypes]);

    const optionsStatusCode = useMemo(() => [
        { label: statusTypes.length > 0 ? 'Select Status Code' : ' No Status Code Available', value: ''},
        ...statusTypes.map((status) => ({
            label: status.shortDescription,
            value: status.codeValue,
        }))
    ], [statusTypes]);

    const fetchData = load(async () => {
        xmlTemplateService.getTemplates('quote', '').then(setTemplates);
        entityService.getQuoteCodes(TYPE_CODE).then(setCodeTypes);
        entityService.getQuoteCodes(STATUS_CODE).then(setStatusTypes);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const renderNameField = () => {
        return (
            <InputText
                type='text'
                value={request.quoteName}
                label="Quote Name"
                required
                feedbackMsg={error.quoteName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('quoteName', e.target.value)}
            />
        );
    };

    const renderTypeCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.typeCode}
                label="Type Code"
                options={optionsTypeCode}
                onChange={(o: Options) => handleFieldChanged('typeCode', o.value)}
                required
                feedbackMsg={error.typeCode}
            />
        );
    };

    const renderStatusCodeField = () => {
        return (
            <InputText
                type='custom-select'
                label="Status Code"
                value={request.statusCode}
                options={optionsStatusCode}
                onChange={(o: Options) => handleFieldChanged('statusCode', o.value)}
                required
                feedbackMsg={error.statusCode}
            />
        );
    };

    const renderEffectiveFromField = () => {
        return (
            <InputText
                type='date'
                label="Effective From"
                value={request.effectiveFrom}
                startDate={request.effectiveFrom}
                onChange={(d: Date) => handleFieldChanged('effectiveFrom', d)}
                required
                feedbackMsg={error.effectiveFrom}
            />
        );
    };

    const renderEffectiveToField = () => {
        return (
            <InputText
                type='date'
                label="Effective To"
                value={request.effectiveTo}
                startDate={request.effectiveTo}
                onChange={(d: Date) => handleFieldChanged('effectiveTo', d)}
            />
        );
    };

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={FILTERED_OVERRIDE}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = (field: TypeFieldString | 'effectiveFrom' | 'effectiveTo', value: string | Date) => {
        if(isFieldString(field)) {
            setRequest(
                produce(request, (draft) => {
                    // type verification is done in isFieldString
                    // @ts-ignore
                    draft[field] = isFieldString(field) ? value as string : value as Date;
                }),
            );
        }

        if(field === 'quoteName' || field === 'effectiveFrom') {
            setError(produce(error, (draft => {
                draft[field] = '';
            })));
        }
    }

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createQuoteDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const quote = await entityService.createQuote(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            quote.entityType,
            quote.getGuid(),
            'XML_DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    return (
        <FrameworkComponent
            title='Create Quote'
            loading={loading}
            onSubmit={createQuoteDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    {renderNameField()}
                    {renderTypeCodeField()}
                    {renderStatusCodeField()}
                    {renderEffectiveFromField()}
                    {renderEffectiveToField()}
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>{renderOverride()}</PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Template'} defaultOpened>
                <PanelSectionContainer>
                    <TemplateComponent options={optionsTemplate} onChange={(value) => handleFieldChanged('templateName', value)} />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

QuoteDefinitionCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default QuoteDefinitionCreationWizard;
