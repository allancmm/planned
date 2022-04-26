import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import produce from 'immer';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateRequirementGroupRequest from '../../../lib/domain/entities/createRequirementGroupRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import {InputText} from "../../../components/general";
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

interface RequirementGroupProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const RequirementGroupCreationWizard = ({
                                            entityService,
                                            entityInformationService,
                                        }: RequirementGroupProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateRequirementGroupRequest>(new CreateRequirementGroupRequest());

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides = {[
                    { name: OverrideEnumType.REQUIREMENT.value, value: OverrideEnumType.REQUIREMENT.code }
                ]}
                showGeneralComponent={false}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleNameChanged = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.requirementGroupName = val;
            }),
        );
        setErrorValidation({ requirementGroupName: ''});
    };

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if(!request.requirementGroupName) {
            newError.requirementGroupName = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if(!isOverrideValid) {
            isValid = false;
        }

        setErrorValidation(newError);
        !isValid && setShowMessageOverride(true);
        return isValid;
    }
    const createRequirementGroup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const requirementGroup = await load(entityService.createRequirementGroup)(request);
            const entityInformation = await load(entityInformationService.getEntityInformation)(
                requirementGroup.entityType,
                requirementGroup.getGuid(),
                'GROUP',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    };

    return (
        <FrameworkComponent
            title='Create Requirement Group'
            loading={loading}
            onSubmit={createRequirementGroup}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        value={request.requirementGroupName}
                        label="Requirement Group Name"
                        feedbackMsg={errorValidation.requirementGroupName}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChanged(e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Link to Requirement'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

RequirementGroupCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default RequirementGroupCreationWizard;

class ErrorValidation {
    requirementGroupName = '';
}