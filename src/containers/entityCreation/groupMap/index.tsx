import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import produce, {immerable} from 'immer';
import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import { InputText, Options } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateMapRequest from '../../../lib/domain/entities/CreateMapRequest';
import { MapCodeEnum } from '../../../lib/domain/enums/mapValueCode';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

interface MapCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}
const MapCreationWizard = ({ entityService, entityInformationService }: MapCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const [request, setRequest] = useState<CreateMapRequest>(new CreateMapRequest());
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const validateForm = () : boolean => {
        let isValid = true;
        const newError = new ErrorValidation();

        Object.keys(newError).map((key) => {
            const field = key as keyof CreateMapRequest;
            if(!request[field]) {
                // @ts-ignore
                newError[key] = MSG_REQUIRED_FIELD;
                isValid = false;
            }
        });

        setErrorValidation(newError);
        return isValid;
    }

    const createMap = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const mapGroup = await load(entityService.createMapGroup)(request);
            const entityInformation = await load(entityInformationService.getEntityInformation)(
                mapGroup.entityType,
                mapGroup.getGuid(),
                'MAP'
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    };

    const handleFieldChanged = (field: 'name' | 'criterionName' | 'criterionType' | 'valueType', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setErrorValidation(produce(errorValidation, (draft) => {
            draft[field] = '';
        }));
    }

    return (
        <FrameworkComponent
            title='Create Map Group'
            loading={loading}
            onSubmit={createMap}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        label="Map Description:"
                        type='text'
                        value={request.name}
                        feedbackMsg={errorValidation.name}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('name', e.target.value)}
                    />

                    <InputText
                        label="Criterion Name:"
                        type='text'
                        value={request.criterionName}
                        feedbackMsg={errorValidation.criterionName}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('criterionName', e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        label="Criterion Data Type:"
                        feedbackMsg={errorValidation.criterionType}
                        value={request.criterionType}
                        options={MapCodeEnum.codes.map((c) => ({ label: c.value, value: c.code }))}
                        onChange={(o: Options) => handleFieldChanged('criterionType', o.value)}
                        required
                    />

                    <InputText
                        type='custom-select'
                        label="Value Data Type:"
                        feedbackMsg={errorValidation.valueType}
                        value={request.valueType}
                        options={MapCodeEnum.codes.map((c) => ({ label: c.value, value: c.code }))}
                        onChange={(o: Options) => handleFieldChanged('valueType', o.value)}
                        required
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

MapCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default MapCreationWizard;

class ErrorValidation {
    [immerable] = true;
    name = '';
    criterionName = '';
    criterionType = '';
    valueType = '';
}
