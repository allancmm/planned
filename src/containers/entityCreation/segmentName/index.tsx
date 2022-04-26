import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import {InputText, Options} from "../../../components/general";
import {immerable, produce} from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';

import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import CreateSegmentNameRequest from '../../../lib/domain/entities/createSegmentNameRequest';
import MapKeyValue from '../../../lib/domain/entities/mapKeyValue';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import TemplateComponent from "../../general/components/templateComponent";
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

class ErrorSegmentName {
    [immerable] = true;
    name = '';
    typeCode = '';
}

interface SegmentNameCreationProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const SegmentNameCreationWizard = ({
    entityService,
    xmlTemplateService,
    entityInformationService,
}: SegmentNameCreationProps) => {
    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const [request, setRequest] = useState<CreateSegmentNameRequest>(new CreateSegmentNameRequest());
    const { closeRightbar } = useContext(RightbarContext);
    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [codeTypes, setCodeTypes] = useState<MapKeyValue[]>([]);
    const [error, setError] = useState(new ErrorSegmentName());
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [showMessageOverride, setShowMessageOverride] = useState(false);

    const optionsTypeCode = useMemo(() =>
        [{label: codeTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
            ...codeTypes.map((code) => ({
                label: code.shortDescription,
                value: code.codeValue,
            }))], [codeTypes]);

    const optionsTemplate = useMemo(() =>
        [ {label: templates.length > 0 ? 'Select One' : ' No Template Available', value: ''},
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            }))], [templates]);

    // TODO - Allan - calls independent. Use Promise.all or Promise.allSettled
    const fetchData = async () => {
        setTemplates(await load(xmlTemplateService.getTemplates)('segment name', ''));
        setCodeTypes(await load(entityService.getSegmentNameTypes)());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides = {[
                    { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code },
                    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code },
                ]}
                load={load}
                setGeneralComponentState={() => setShowMessageOverride(false)}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
            />
        );
    };

    const handleFieldChange = (field: 'name' | 'typeCode' | 'templateName', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );

        if(field === 'name' || field === 'typeCode') {
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

    const createSegmentName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()){
            const segment = await load(entityService.createSegment)(request);
            const entityInformation = await load(entityInformationService.getEntityInformation)(
                segment.entityType,
                segment.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    };

    return (
        <FrameworkComponent
            title='Create Segment Name'
            loading={loading}
            onSubmit={createSegmentName}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.name}
                        label="Segment Name"
                        feedbackMsg={error.name}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange('name', e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={request.typeCode}
                        label="Type Code"
                        options={optionsTypeCode}
                        onChange={(o : Options) => handleFieldChange('typeCode', o.value)}
                        required
                        feedbackMsg={error.typeCode}
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
                    <TemplateComponent
                        name={request.templateName}
                        options={optionsTemplate}
                        disabled={templates.length === 0}
                        onChange={(value) => handleFieldChange('templateName', value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

SegmentNameCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default SegmentNameCreationWizard;
