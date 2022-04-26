import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import { InputText } from "../../../components/general";
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateFileOutputRequest from '../../../lib/domain/entities/createFileOutputRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";


interface FileOutputCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const FileOutputCreationWizard = ({entityInformationService, entityService}: FileOutputCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateFileOutputRequest>(new CreateFileOutputRequest());
    const [msgErrorValidation, setMsgErrorValidation] = useState('');

    const handleFileOutputName = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.name = val;
            }),
        );
        setMsgErrorValidation('');
    };

    const createFileOutput = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!request.name) {
            setMsgErrorValidation(MSG_REQUIRED_FIELD);
            return;
        }
        const fileOutput = await entityService.createFileOutput(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            fileOutput.entityType,
            fileOutput.getGuid(),
            'XSLT',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    return (
        <FrameworkComponent
            title='Create File Output'
            loading={loading}
            onSubmit={createFileOutput}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        label="File Output Name"
                        value={request.name}
                        required
                        feedbackMsg={msgErrorValidation}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileOutputName(e.target.value.trim())}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

FileOutputCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default FileOutputCreationWizard;