import React, { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import {immerable, produce} from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateMaskDetailRequest from '../../../lib/domain/entities/createMaskDetailRequest';

import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

type TypeFieldMaskDetail = 'maskName' | 'level' | 'expressionInput' | 'expressionOutput' | 'piiField';
const LEVEL_SECURITY_CODE = "AsCodeMaskSecurityLevel";

class ErrorMaskDetail {
    [immerable] = true;
    maskName = '';
    level = '';
    expressionInput = '';
    expressionOutput = '';
}

interface MaskDetailProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const MaskDetailCreationWizard = ({
    entityService,
    entityInformationService,
}: MaskDetailProps) => {
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateMaskDetailRequest>(new CreateMaskDetailRequest());
    const [securityLevels, setSecurityLevels] = useState<BasicEntity[]>([]);
    const [error, setError] = useState(new ErrorMaskDetail());

    const optionsLevel = useMemo(() => [
        { label: securityLevels.length > 0 ? 'Select Type Level' : ' No Level Available', value: '' },
        ...securityLevels.map((code) => ({
            label: code.name,
            value: code.value,
        }))
    ], [securityLevels]);

    const fetchData = load(async () => {
        setSecurityLevels(await entityService.getCodes(LEVEL_SECURITY_CODE));
    });

    useEffect(() => {
        fetchData();
    }, []);

    const renderNameField = () => {
        return (
            <InputText
                type='text'
                value={request.maskName}
                label="Mask Name"
                required
                feedbackMsg={error.maskName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('maskName',e.target.value)}
            />
        );
    }

    const renderLevelSecurityCodeField = () => {
        return (
            <InputText
                type='custom-select'
                value={request.level}
                label="Code Security Level"
                options={optionsLevel}
                required
                feedbackMsg={error.level}
                onChange={(o : Options) => handleFieldChanged('level', o.value)}
            />
        );
    }

    const renderInputFormat = () => {
        return (
            <InputText
                type='text'
                value={request.expressionInput}
                label="Input Format"
                required
                feedbackMsg={error.expressionInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('expressionInput', e.target.value)}
            />
        );
    }

    const renderOutputFormat = () => {
        return (
            <InputText
                type='text'
                value={request.expressionOutput}
                label="Output Format"
                required
                feedbackMsg={error.expressionOutput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('expressionOutput', e.target.value)}
            />
        );
    }

    const renderPiiField = () => {
        return (
            <InputText
                type='text'
                value={request.piiField}
                label="PiiField"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('piiField', e.target.value)}
            />
        );
    }


    const handleFieldChanged = async (field: TypeFieldMaskDetail, value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        field !== 'piiField' && setError(produce(error, (draft => { draft[field] = ''; })));
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createMaskDetail = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const mask = await entityService.createMaskDetail(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                mask.entityType,
                mask.getGuid(),
                'DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Mask'
            loading={loading}
            onSubmit={createMaskDetail}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    {renderNameField()}
                    {renderLevelSecurityCodeField()}
                    {renderInputFormat()}
                    {renderOutputFormat()}
                    {renderPiiField()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

MaskDetailCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default MaskDetailCreationWizard;