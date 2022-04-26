import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import { InputText } from "../../../components/general";
import { produce } from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
} from '../../../lib/context';
import CreateSqlScriptRequest from '../../../lib/domain/entities/createSqlScriptRequest';

import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

interface SqlScriptProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const SqlScriptCreationWizard = ({
    entityService,
    entityInformationService,
}: SqlScriptProps) => {
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);

    const [request, setRequest] = useState<CreateSqlScriptRequest>(new CreateSqlScriptRequest());
    const [errorMessage, setErrorMessage] = useState('');

    const [loading, load] = useLoading();

    const handleNameChanged = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.scriptName = val;
            }),
        );
        setErrorMessage('');
    };


    const createSqlScript = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!request.scriptName) {
            setErrorMessage(MSG_REQUIRED_FIELD);
            return;
        }
        const sqlScript = await entityService.createSqlScript(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            sqlScript.entityType,
            sqlScript.getGuid(),
            'SQL_DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    return (
        <FrameworkComponent
            title='Create Sql Script'
            loading={loading}
            onSubmit={createSqlScript}
            onCancel={closeRightbar}
        >
            <form id="CreateSqlScript" onSubmit={createSqlScript}>
                <CollapseContainer title={'General'} defaultOpened>
                    <PanelSectionContainer>
                        <InputText
                            type='text'
                            value={request.scriptName}
                            label="Script Name"
                            required
                            feedbackMsg={errorMessage}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChanged(e.target.value)}
                        />
                    </PanelSectionContainer>
                </CollapseContainer>
            </form>
        </FrameworkComponent>
    );
};

SqlScriptCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default SqlScriptCreationWizard;