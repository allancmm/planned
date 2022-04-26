import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText } from "../../../components/general";
import produce, {immerable} from 'immer';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateCommentsTemplateRequest from '../../../lib/domain/entities/createCommentsTemplateRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

class ErrorComments {
    [immerable] = true;
    templateName = '';
    templateText = '';
}

const FILTERED_OVERRIDES = [
    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
    { name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code },
    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code },
    { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code }
];

interface CommentsTemplateCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const CommentsTemplateCreationWizard = ({ entityService, entityInformationService }: CommentsTemplateCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState(new CreateCommentsTemplateRequest());
    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorComments());

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createCommentsTemplate = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const commentsTemplate = await entityService.createCommentsTemplate(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            commentsTemplate.entityType,
            commentsTemplate.getGuid(),
            'DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    const handleFieldChanged = async (field: 'templateName' | 'templateText', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setError(produce(error, (draft => {
            draft[field] = '';
        })));
    };

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={FILTERED_OVERRIDES}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    return (
        <FrameworkComponent
            title='Create Comments Template Screen'
            loading={loading}
            onSubmit={createCommentsTemplate}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        label='Template Name'
                        value={request.templateName}
                        required
                        feedbackMsg={error.templateName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('templateName', e.target.value)}
                    />
                    <InputText
                        type='textarea'
                        label='Template Text'
                        value={request.templateText}
                        required
                        feedbackMsg={error.templateText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('templateText', e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Override" defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );

}


CommentsTemplateCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default CommentsTemplateCreationWizard;