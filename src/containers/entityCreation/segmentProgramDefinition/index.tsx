import {CollapseContainer, useLoading} from "equisoft-design-ui-elements";
import produce, {immerable} from "immer";
import React, {useEffect, FormEvent, useContext, useState, useMemo} from "react";
import { InputText, Options } from "../../../components/general";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import { defaultEntitiesService, defaultEntityInformationService } from "../../../lib/context";
import CreateSegmentProgramRequest from "../../../lib/domain/entities/CreateSegmentProgramRequest";
import ProgramDefinition from "../../../lib/domain/entities/programDefinition";
import SegmentName from "../../../lib/domain/entities/segmentName";
import EntityService from "../../../lib/services/entitiesService";
import EntityInformationService from "../../../lib/services/entityInformationService";
import {validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

class ErrorSegmentDefinition {
    [immerable] = true;
    segmentGuid = '';
    programDefinitionGUID = '';
}
interface SegmentProgramDefinitionProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const SegmentProgramDefinitionCreationWizard = ({ entityService, entityInformationService }: SegmentProgramDefinitionProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [request, setRequest] = useState<CreateSegmentProgramRequest>(new CreateSegmentProgramRequest());
    const [segmentNamesList, setSegmentNamesList] = useState<SegmentName[]>([]);
    const [definitionsList, setDefinitionsList] = useState<ProgramDefinition[]>([]);
    const dispatch = useTabActions();
    const [showError, setShowError] = useState<boolean>();
    const [error, setError] = useState(new ErrorSegmentDefinition());

    const [loading, load] = useLoading();

    const optionsSegmentNamesList = useMemo(() => [
        { label: segmentNamesList.length > 0 ? 'Select One' : ' No Segment name Available', value: ''},
        ...segmentNamesList.map((t) => ({
            label: t.segmentName,
            value: t.segmentNameGuid,
        }))
    ], [segmentNamesList]);

    const optionsDefinitionsList = useMemo(() => [
        {label: definitionsList.length > 0 ? 'Select One' : ' No Program Definition Available', value: ''},
        ...definitionsList.map((t) => ({
            label: t.programDefinitionName,
            value: t.programDefinitionGuid,
        }))
    ], [definitionsList]);

    const fetchData = load(async () => {
        const [segmentsResp, definitionResp] = await Promise.allSettled([
            entityService.getAllSegmentNames(),
            entityService.getAllProgramDefinition()
        ])
        setSegmentNamesList(segmentsResp.status === 'fulfilled' ? segmentsResp.value : []);
        setDefinitionsList(definitionResp.status === 'fulfilled' ? definitionResp.value : []);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleFieldChange = async (field: 'segmentGuid' | 'programDefinitionGUID', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setShowError(false);
        setError(produce(error, (draft => {
            draft[field] = '';
        })));
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createSegmentProgramDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const exist = await entityService.segmentProgramExist(request);
            if (!exist) {
                const segmentProgram = await entityService.createSegmentProgramDefinition(request);

                const entityInformation = await entityInformationService.getEntityInformation(
                    segmentProgram.entityType,
                    segmentProgram.getGuid(),
                    'XML_DATA',
                );
                dispatch({ type: OPEN, payload: { data: entityInformation } });
                closeRightbar();
            } else {
                setShowError(true);
            }
        }
    });

    return (
        <FrameworkComponent
            title='Create Segment Program Definition'
            loading={loading}
            onSubmit={createSegmentProgramDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='custom-select'
                        value={request.segmentGuid}
                        label="Segment name"
                        required
                        feedbackMsg={error.segmentGuid}
                        options={optionsSegmentNamesList}
                        onChange={(o: Options) => handleFieldChange('segmentGuid', o.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={request.programDefinitionGUID}
                        label="Program Definition Name"
                        required
                        feedbackMsg={error.programDefinitionGUID}
                        options={optionsDefinitionsList}
                        onChange={(o: Options) => handleFieldChange('programDefinitionGUID', o.value)}
                    />
                    <span style={{ color: 'red' }}>
                    {showError ? 'Error : Plan program definition exist' : ''}
                </span>
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

SegmentProgramDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default SegmentProgramDefinitionCreationWizard;